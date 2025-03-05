package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"server/handlers/utils"

	"github.com/lib/pq"
)

type AttendeesTimeslotsForEvent struct {
	EventId     string   `json:"eventId"`
	AttendeeIds []string `json:"attendeeIds"`
}

type AttendeeAvailability struct {
	AttendeeId    string `json:"attendeeId" gorm:"column:id"`
	StartDateTime string `json:"startDateTime"`
}

// Authenticated endpoint for returning attendees' available timeslots for an event
func GetAttendeesTimeslotsForEvent(env utils.ServerEnv, w http.ResponseWriter, r *http.Request) error {
	slog.Info("Getting attendee available timeslots for event")

	var payload AttendeesTimeslotsForEvent

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		return utils.StatusError{Code: 400, Err: err}
	}
	slog.Info("payload: ", payload)

	var response []AttendeeAvailability

	rawQuery := `
		SELECT t.start_date_time, u.id FROM timeslots t 
		JOIN events e ON t.event_id = e.id
		JOIN event_timeslot_attendee_availabilities eta ON t.id = eta.timeslot_id
		JOIN availabilities a ON eta.availability_id = a.id
		JOIN users u ON a.attendee_id = u.id
		WHERE e.id = $1
		AND u.id = ANY($2)
		`

	eventID := payload.EventId
	attendeeIDs := pq.Array(payload.AttendeeIds)

	err = env.GetDB().Raw(rawQuery, eventID, attendeeIDs).Find(&response).Error

	if err != nil {
		return utils.StatusError{Code: 400, Err: err}
	}

	slog.Info("attendees availabilities for an event found")

	utils.JSONResponse(w, response)
	return nil
}
