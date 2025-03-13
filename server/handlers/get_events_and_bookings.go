package handlers

import (
	"fmt"
	"log/slog"
	"net/http"
	"server/handlers/utils"
	"server/models"

	"gorm.io/gorm/clause"
)

type getEventsAndBookingsResponse struct {
	Events   []*models.Event   `json:"events"`
	Bookings []*models.Booking `json:"bookings"`
}

// returns all events created by user and any bookings
func GetEventsAndBookings(env utils.ServerEnv, w http.ResponseWriter, r *http.Request) error {
	slog.Info("Getting Events")

	userId, err := utils.GetRequestUserId(r)
	if err != nil {
		return utils.StatusError{Code: 403, Err: err}
	}

	slog.Info("userId: ", userId)

	// Get event
	events := []*models.Event{}
	err = env.GetDB().Where("creator_id = ?", userId).Find(&events).Error
	if err != nil {
		return utils.StatusError{Code: 500, Err: err}
	}

	eventIds := []uint{}
	for _, event := range events {
		eventIds = append(eventIds, event.ID)
	}

	bookings := []*models.Booking{}
	db := env.GetDB()
	err = db.Preload(clause.Associations).Joins("JOIN timeslots ON bookings.timeslot_id = timeslots.id").Where("timeslots.event_id IN ?", eventIds).
		Find(&bookings).Error
	if err != nil {
		return utils.StatusError{Code: 500, Err: err}
	}

	slog.Info(fmt.Sprintf("Num events found: %d", len(events)))
	slog.Info(fmt.Sprintf("Num bookings found: %d", len(bookings)))

	response := getEventsAndBookingsResponse{events, bookings}

	utils.JSONResponse(w, response)

	return nil
}
