package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"server/handlers/utils"
	"server/helper"
	"server/models"
	"server/models/enumtypes"
	"slices"
	"strings"
	"time"

	"gorm.io/gorm"
)

type CreateMeetingPayload struct {
	MeetingTitle    string   `json:"meetingTitle" validate:"required"`
	MeetingDesc     string   `json:"meetingDesc"`
	MeetingDuration int      `json:"meetingDuration" validate:"required"`
	MeetingFormat   string   `json:"meetingFormat" validate:"required"`
	Attendees       []string `json:"attendees" validate:"required"` // emails
	Timeslots       []string `json:"timeslots" validate:"required"`
	StartDateRange  string   `json:"startDateRange" validate:"required"`
	EndDateRange    string   `json:"endDateRange" validate:"required"`
}

func CreateEvent(env utils.ServerEnv, w http.ResponseWriter, r *http.Request) error {
	slog.Info("Creating event")
	var payload CreateMeetingPayload

	db := env.GetDB()
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		return utils.StatusError{Code: 400, Err: err}
	}

	userContext, err := utils.GetUserContext(r)
	if err != nil {
		return utils.StatusError{Code: 403, Err: err}
	}

	userId, err := utils.GetUserId(userContext)
	if err != nil {
		return utils.StatusError{Code: 403, Err: err}
	}

	creatorEmail := userContext["email"]
	if creatorEmail == "" {
		return utils.StatusError{Code: 400, Err: errors.New("empty user alias or email")}
	}

	startDateRange, err := time.Parse(time.RFC3339, payload.StartDateRange)
	if err != nil {
		return utils.StatusError{Code: 400, Err: err}
	}
	endDateRange, err := time.Parse(time.RFC3339, payload.EndDateRange)
	if err != nil {
		return utils.StatusError{Code: 400, Err: err}
	}
	if len(payload.Attendees) == 0 {
		return utils.StatusError{Code: 400, Err: errors.New("no attendees provided")}
	}
	if len(payload.Timeslots) == 0 {
		return utils.StatusError{Code: 400, Err: errors.New("no timeslots provided")}
	}

	attendees, err := createAttendees(db, payload.Attendees)
	if err != nil {
		return utils.StatusError{Code: 500, Err: err}
	}

	event := models.Event{
		Title:          payload.MeetingTitle,
		Description:    &payload.MeetingDesc,
		Duration:       uint32(payload.MeetingDuration),
		StartDateRange: startDateRange,
		EndDateRange:   endDateRange,
		Status:         enumtypes.PENDING_INPUT,
		Format:         enumtypes.Format(strings.ToUpper(payload.MeetingFormat)),
		CreatorID:      userId,
		Attendees:      &attendees,
	}

	result := db.Create(&event)
	if result.Error != nil {
		slog.Warn(fmt.Sprintf("Failed to create event: %s", result.Error))
		return utils.StatusError{Code: 500, Err: errors.New("failed to create event")}
	}

	err = createTimeslots(db, event, payload.Timeslots)
	if err != nil {
		slog.Warn(fmt.Sprintf("Failed to create timeslots for event: %s", result.Error))
		return utils.StatusError{Code: 500, Err: err}
	}

	slog.Info(fmt.Sprintf("Event with title '%s' created!", event.Title))

	err = sendInviteEmails(event, creatorEmail)
	if err != nil {
		return utils.StatusError{Code: 500, Err: err}
	}

	utils.JSONResponse(w, event)
	return nil
}

func createAttendees(db *gorm.DB, emails []string) ([]models.User, error) {
	var attendees []models.User
	result := db.Where("email IN ?", emails).Find(&attendees)
	if result.Error != nil {
		return nil, errors.New("failed to query existing attendee accounts")
	}

	var existingEmails []string
	for _, attendee := range attendees {
		existingEmails = append(existingEmails, attendee.Email)
	}
	slog.Info(fmt.Sprintf("Found existing users with emails: %v", existingEmails))

	var newUsers []models.User
	for _, email := range emails {
		if slices.Contains(existingEmails, email) {
			continue
		}
		newUsers = append(newUsers, models.User{
			Email: email,
		})
	}

	if len(newUsers) > 0 {
		result = db.Create(newUsers)
		if result.Error != nil {
			return nil, errors.New("failed to create new attendee accounts")
		}
		slog.Info(fmt.Sprintf("Created new attendee users with emails: %v", newUsers))
	}

	attendees = append(attendees, newUsers...)
	return attendees, nil
}

func createTimeslots(db *gorm.DB, event models.Event, timeslotStr []string) error {
	timeslots := []models.Timeslot{}

	for _, timeslotStr := range timeslotStr {

		start, err := time.Parse(time.RFC3339, timeslotStr)
		if err != nil {
			return err
		}
		end := start.Add(time.Minute * 30)

		timeslot := models.Timeslot{
			StartDateTime: start,
			EndDateTime:   end,
			EventID:       event.ID,
		}

		timeslots = append(timeslots, timeslot)
	}

	result := db.Create(timeslots)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func getAttendeeUniqueHash(eventId uint, userEmail string) string {
	// Encode meeting hash
	meeting := fmt.Sprintf("%s;%d", userEmail, eventId)
	return helper.EncodeBase64(meeting)
}

func sendInviteEmails(event models.Event, creatorEmail string) error {

	// Map User array to just emails
	for _, attendee := range *event.Attendees {
		attendeeEmail := attendee.Email
		slog.Info(fmt.Sprintf("Sending invite to: %s", attendeeEmail))

		emailPayload := make(map[string]any)
		// schedulr will send email on behalf of meeting organiser replace meeting owner's email with booking.gov.sg domain
		emailPayload["from"] = "schedulr@booking.gov.sg"
		emailPayload["to"] = []string{attendeeEmail}
		emailPayload["subject"] = "(Test) Meeting Scheduled - " + event.Title
		emailPayload["html"] = bindEmailConfirmationBody(event, attendeeEmail, creatorEmail)

		utils.SendEmail(emailPayload)

		slog.Info(fmt.Sprintf("Sent invite email to: %s", attendeeEmail))
	}

	return nil
}

func bindEmailConfirmationBody(event models.Event, attendeeEmail string, creatorEmail string) string {
	var eventDescription string
	if event.Description == nil {
		eventDescription = ""
	} else {
		eventDescription = *event.Description
	}

	uniqueHash := getAttendeeUniqueHash(event.ID, attendeeEmail)
	clientUrl := os.Getenv("CLIENT_URL")
	uniqueLink := fmt.Sprintf("%s/public/%s", clientUrl, uniqueHash)

	return `
	<!DOCTYPE html>
	<html>

	<head>
		<style>
			body {
				font-family: Arial, sans-serif;
				line-height: 1.6;
				color: #333;
			}

			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
			}

			.header {
				background-color: #f8f9fa;
				padding: 20px;
				border-radius: 5px;
				margin-bottom: 20px;
			}

			.details {
				margin-bottom: 20px;
			}

			.footer {
				font-size: 12px;
				color: #666;
				border-top: 1px solid #eee;
				padding-top: 20px;
				margin-top: 20px;
			}

			.param {
				color: #94A3B8;
			}
		</style>
	</head>

	<body>
		<div class="container">
			<div class="header">
				<h2 style="color: #3949AB;"> Schedulr </h2>
			</div>
			<span style="color: #0F172A; font-size: 20px; font-weight: 500;">Input your availabilities for ‘` + event.Title + `’</span>
			<hr style="margin-top: 16px; margin-bottom: 16px;" />
			<div class="details">
				<p>Dear invitee, </p>
				<p>You are invited to provide your availability for the following: </p>
				<p>
					<span class="param">Meeting Title:</span> <strong>` + event.Title + `</strong>
					<br />
					<span class="param">Meeting duration:</span> ` + fmt.Sprintf("%d", event.Duration) + `
					<br />
					<span class="param">Meeting description (if applicable):</span> ` + eventDescription + `
					<br />
				</p>
				<p>Please kindly click on this link to select/ provide your available timeslots:<br /><a href="` +
		uniqueLink +
		`">` + uniqueLink + `</a></p>
				<p>For queries, please contact <strong><em>Christy Yeo</em></strong> at <strong><em>+65 8123 4567</em></strong>.
				</p>
				<p>Thank you!</p>
			</div>
			<div class="footer">
				<p>Should you have any questions, please contact the meeting coordinator at ` + creatorEmail + `.</p>
			</div>
		</div>
	</body>

	</html>

			`
}
