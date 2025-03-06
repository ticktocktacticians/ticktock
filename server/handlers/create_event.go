package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"server/handlers/utils"
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

	userId, err := utils.GetRequestUserId(r)
	if err != nil {
		return utils.StatusError{Code: 403, Err: err}
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
