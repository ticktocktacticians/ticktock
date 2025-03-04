package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"server/handlers/utils"
	"server/models"

	"github.com/google/uuid"
)

type Availability struct {
	UserID    uuid.UUID         `json:"userId"`
	Timeslots []models.Timeslot `json:"timeslots"`
}

// This is a public API for attendee. It creates the attendee timeslot availability.
func CreateAttendeeAvailability(env utils.ServerEnv, w http.ResponseWriter, r *http.Request) error {
	slog.Info("Creating attendee availability")

	var requestData Availability

	// Parse the request body into the struct
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Unable to parse request body", http.StatusBadRequest)
		return err
	}

	// Create availability
	var availabilityModel models.Availability
	availabilityModel.AttendeeID = requestData.UserID
	availabilityModel.Timeslots = &requestData.Timeslots

	result := env.GetDB().Create(&availabilityModel)
	if result.RowsAffected == 0 {
		slog.Warn("Availability not created")
		return utils.StatusError{Code: 404, Err: errors.New("failed to create availability")}
	}

	slog.Info("Availabilities Created")

	w.WriteHeader(http.StatusCreated)
	return nil
}
