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
)

// This is a public API for attendee. It returns the attendee event timeslots.
func GetAttendeeAvailabity(env utils.ServerEnv, w http.ResponseWriter, r *http.Request) error {
	slog.Info("Getting attendee availability")

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

	// Get user
	var user models.User
	userResult := env.GetDB().Where("email = ?", userEmail).First(&user)
	if userResult.RowsAffected == 0 {
		slog.Warn(fmt.Sprintf("User not found: %s", userEmail))
	}

	// Get event
	var availability models.Availability
	result := env.GetDB().Preload("Timeslots", "event_id = ?", eventId).First(&availability, "attendee_id = ?", user.ID)
	if result.RowsAffected == 0 || (availability.Timeslots != nil && len(*availability.Timeslots) == 0) {
		slog.Warn(fmt.Sprintf("Availability not found: %s", eventId))
		return utils.StatusError{Code: 404, Err: errors.New("failed to get availability")}
	}

	slog.Info("availability found")

	utils.JSONResponse(w, availability)
	return nil
}
