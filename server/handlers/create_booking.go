package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"server/handlers/utils"
	"server/models"
	"time"

	"gorm.io/gorm/clause"
)

type CreateBookingPayload struct {
	StartDateTime string `json:"startDateTime" validate:"required"`
	EventId       string `json:"eventId" validate:"required"`
}

func CreateBooking(env utils.ServerEnv, w http.ResponseWriter, r *http.Request) error {
	slog.Info("Creating booking")
	var payload CreateBookingPayload

	db := env.GetDB()
	err := json.NewDecoder(r.Body).Decode(&payload)

	if err != nil {
		return utils.StatusError{Code: 400, Err: err}
	}

	slog.Info(payload.EventId, payload.StartDateTime)
	startDateTime, err := time.Parse(time.RFC3339, payload.StartDateTime)

	if err != nil {
		return utils.StatusError{Code: 400, Err: err}
	}

	// get event from event id
	var eventModel models.Event
	result := env.GetDB().Preload(clause.Associations).First(&eventModel, payload.EventId)
	if result.RowsAffected == 0 {
		slog.Warn(fmt.Sprintf("Event not found: %s", payload.EventId))
		return utils.StatusError{Code: 404, Err: errors.New("failed to get event")}
	}
	slog.Info("Event found: ", eventModel.Title)

	timeslot := models.Timeslot{
		StartDateTime: startDateTime,
		EndDateTime:   startDateTime.Add(time.Duration(eventModel.Duration) * time.Minute),
		EventID:       eventModel.ID,
	}

	// create timeslot
	timeslotCreated := db.Create(&timeslot)
	if timeslotCreated.Error != nil {
		return timeslotCreated.Error
	}
	slog.Info("Successfully created timeslots = ", timeslot)

	// create booking with timeslot id
	booking := models.Booking{
		TimeslotID: timeslot.ID,
		// only for MVP where all attendees will need to accept the timeslot
		Attendees: eventModel.Attendees,
	}
	bookingCreated := db.Create(&booking)

	if bookingCreated.Error != nil {
		return bookingCreated.Error
	}

	slog.Info("Successfully created booking = ", booking)

	// update event's status
	result = db.Model(&eventModel).Update("status", "SCHEDULED")
	if result.Error != nil {
		slog.Error("Failed to update event status:", result.Error)
		return utils.StatusError{Code: 500, Err: errors.New("failed to update event status")}
	}
	slog.Info("Successfully updated event status to SCHEDULED")

	// get the booking and return in response. currently just needed for the booking id
	createdBooking := models.Booking{}
	bookingResult := env.GetDB().First(&createdBooking, booking.ID)
	if bookingResult.RowsAffected == 0 {
		slog.Warn(fmt.Sprintf("Booking not found: %s", booking.ID))
		return utils.StatusError{Code: 404, Err: errors.New("failed to get booking")}
	}

	utils.JSONResponse(w, createdBooking)
	return nil
}
