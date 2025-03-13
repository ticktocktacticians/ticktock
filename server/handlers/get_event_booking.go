package handlers

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"server/handlers/utils"
	"server/models"

	"github.com/go-chi/chi/v5"
)

func GetEventBooking(env utils.ServerEnv, w http.ResponseWriter, r *http.Request) error {
	slog.Info("Getting booking")

	eventId := chi.URLParam(r, "id")

	var bookingModel models.Booking

	result := env.GetDB().
		Preload("Timeslot").
		Preload("Attendees").
		Joins("JOIN timeslots ON timeslots.id = bookings.timeslot_id").
		Where("timeslots.event_id = ?", eventId).
		First(&bookingModel)

	if result.RowsAffected == 0 {
		slog.Warn(fmt.Sprintf("booking not found with event id: %s", eventId))
		return utils.StatusError{Code: 404, Err: errors.New("failed to get booking")}
	}
	utils.JSONResponse(w, bookingModel)

	return nil
}
