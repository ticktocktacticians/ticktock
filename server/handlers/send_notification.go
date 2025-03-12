package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"server/handlers/utils"
	"server/helper"
	"server/models"
)

// we need the booking id to be passed in request because theres no way to get
// the booking from just the event id
type SendNotificationPayload struct {
	EventID   string `json:"eventID" validate:"required"`
	BookingId string `json:"bookingId" validate:"required"`
}

// default sending email notification
func SendNotification(env utils.ServerEnv, w http.ResponseWriter, r *http.Request) error {
	slog.Info("Sending email notifications")

	var payload SendNotificationPayload
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		return utils.StatusError{Code: 400, Err: err}
	}

	// get event
	var eventModel models.Event
	eventResult := env.GetDB().Preload("Attendees").Preload("Creator").First(&eventModel, payload.EventID)

	if eventResult.RowsAffected == 0 {
		slog.Warn(fmt.Sprintf("Event not found: %s", payload.EventID))
		return utils.StatusError{Code: 404, Err: errors.New("failed to get event")}
	}
	slog.Info("Event found: ", eventModel)

	// get event owner
	var eventCreator models.User
	userResult := env.GetDB().First(&eventCreator, eventModel.Creator)
	if userResult.RowsAffected == 0 {
		slog.Warn(fmt.Sprintf("User not found: %s", err))
		return utils.StatusError{Code: 404, Err: errors.New("failed to get user")}
	}
	slog.Info("Creator found: ", eventCreator)

	// get Booking from booking id
	var bookingModel models.Booking
	bookingResult := env.GetDB().Preload("Timeslot").First(&bookingModel, payload.BookingId)
	if bookingResult.RowsAffected == 0 {
		slog.Warn(fmt.Sprintf("User not found: %s", err))
		return utils.StatusError{Code: 404, Err: errors.New("failed to get booking")}
	}
	slog.Info("Confirmed Booking: ", bookingModel)

	emailPayload, err := FormulateConfirmationEmail(eventModel, bookingModel)
	if err != nil {
		return utils.StatusError{Code: 400, Err: err}
	}

	utils.SendEmail(emailPayload)

	slog.Info("Email notification sent successfully")
	return nil
}

// Helper function to formulate booking confirmation email to attendees
func FormulateConfirmationEmail(event models.Event, confirmedBooking models.Booking) (map[string]interface{}, error) {

	emailPayload := make(map[string]interface{})

	// Map User array to just emails
	attendeeEmails := make([]string, len(*event.Attendees))
	for i, attendee := range *event.Attendees {
		attendeeEmails[i] = attendee.Email
	}
	slog.Info("Attendee emails: ", attendeeEmails)

	// schedulr will send email on behalf of meeting organiser replace meeting owner's email with booking.gov.sg domain
	emailPayload["from"] = "schedulr@booking.gov.sg"

	emailPayload["to"] = attendeeEmails
	// emailPayload["to"] = []string{"joel_tan@hive.gov.sg", "joel.tan@gt.tech.gov.sg"}
	emailPayload["subject"] = "(Test) Meeting Scheduled - " + event.Title
	emailPayload["html"] = BindEmailConfirmationBody(event, confirmedBooking)

	return emailPayload, nil
}

// function specifically for formulating confirmation booking email body
func BindEmailConfirmationBody(event models.Event, confirmedBooking models.Booking) string {
	descriptionHTML := ""
	if event.Description != nil {
		descriptionHTML = `<p><strong>Description: </strong>` + *event.Description + `</p>`
	}

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
            </style>
		</head>
        <body>
            <div class="container">
                <div class="header">
				  <h2 style="color: #3949AB;"> Schedulr </h2>
                </div>
				<div class="details">
				<ul>
					<p> Dear Attendee, </p>
					<p>Thank you for submitting your availability in time! Please refer to the meeting details below:</p>
					<p><strong>Meeting Title: </strong> ` + event.Title + ` </p>
					` + descriptionHTML + `
					<p><strong>Meeting Date: </strong> ` + helper.FormatDate(confirmedBooking.Timeslot.StartDateTime) + `</p>
					<p><strong>Meeting Timeslot: </strong> ` + helper.FormatTime(confirmedBooking.Timeslot.StartDateTime) + ` - ` + helper.FormatTime(confirmedBooking.Timeslot.EndDateTime) + `</p>
				</ul>
				</div>
				<div class="footer">
                    <p>Should you have any questions, please contact the meeting coordinator at ` + event.Creator.Email + `.</p>
                </div>
				</div> 
			</body>
		</html>
			`
}
