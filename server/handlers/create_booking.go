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
		EndDateTime:   startDateTime.Add(time.Duration(eventModel.Duration)),
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
	}
	bookingCreated := db.Create(&booking)

	if bookingCreated.Error != nil {
		return bookingCreated.Error
	}

	slog.Info("Successfully created booking = ", booking)

	return nil
}
