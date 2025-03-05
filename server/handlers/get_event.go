package handlers

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"server/handlers/utils"
	"server/models"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm/clause"
)

// Authenticated endpoint for returning event details
func GetEventDetails(env utils.ServerEnv, w http.ResponseWriter, r *http.Request) error {
	slog.Info("Getting Event details")

	// Get event id
	eventId := chi.URLParam(r, "id")
	slog.Info("Event Id = ", eventId)

	// Get event
	var eventModel models.Event
	result := env.GetDB().Preload(clause.Associations).First(&eventModel, eventId)
	if result.RowsAffected == 0 {
		slog.Warn(fmt.Sprintf("Event not found: %s", eventId))
		return utils.StatusError{Code: 404, Err: errors.New("failed to get event")}
	}

	slog.Info(fmt.Sprintf("Event found: %s", eventModel.Title))

	utils.JSONResponse(w, eventModel)

	return nil
}
