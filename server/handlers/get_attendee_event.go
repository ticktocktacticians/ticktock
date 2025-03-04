package handlers

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"server/handlers/utils"
	"server/helper"
	"server/models"
	"strings"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm/clause"
)

// This is a public API for attendee. It returns the attendee event timeslots.
func GetAttendeeEvent(env utils.ServerEnv, w http.ResponseWriter, r *http.Request) error {
	slog.Info("Getting attendee event")

	// Get encoded event
	attendeeEvent := chi.URLParam(r, "id")

	slog.Info(attendeeEvent)
	// Decode meeting hash
	meeting, err := helper.DecodeBase64(attendeeEvent)
	if err != nil {
		http.Error(w, "Invalid meeting", http.StatusBadRequest)
		return err
	}

	meetingParts := strings.Split(meeting, ";")
	userEmail := meetingParts[0]
	eventId := meetingParts[1]

	// Get event
	var eventModel models.Event
	result := env.GetDB().Preload(clause.Associations).Preload("Attendees", "email = ?", userEmail).First(&eventModel, eventId)
	if result.RowsAffected == 0 {
		slog.Warn(fmt.Sprintf("Event not found: %s", eventId))
		return utils.StatusError{Code: 404, Err: errors.New("failed to get event")}
	}

	slog.Info(fmt.Sprintf("Event found: %s", eventModel.Title))

	utils.JSONResponse(w, eventModel)
	return nil
}
