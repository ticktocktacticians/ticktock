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
	"strings"
	"time"
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

// TODO: add attendees and timeslots
func CreateEvent(env utils.ServerEnv, w http.ResponseWriter, r *http.Request) error {
	slog.Info("Creating event")
	var payload CreateMeetingPayload

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
		return utils.StatusError{Code: 403, Err: err}
	}
	endDateRange, err := time.Parse(time.RFC3339, payload.EndDateRange)
	if err != nil {
		return utils.StatusError{Code: 403, Err: err}
	}

	attendees := []models.User{}
	timeslots := []models.Timeslot{}

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
		Timeslots:      &timeslots,
	}

	result := env.GetDB().Create(&event)
	if result.Error != nil {
		slog.Warn(fmt.Sprintf("Failed to create event: %s", result.Error))
		return utils.StatusError{Code: 500, Err: errors.New("failed to create event")}
	}

	slog.Info(fmt.Sprintf("Event with title '%s' created!", event.Title))
	utils.JSONResponse(w, event)
	return nil
}
