package handlers

import (
	"fmt"
	"log/slog"
	"net/http"
	"server/handlers/utils"
	"server/models"
)

// returns all events created by user
func GetEvents(env utils.ServerEnv, w http.ResponseWriter, r *http.Request) error {
	slog.Info("Getting Events")

	userId, err := utils.GetRequestUserId(r)
	if err != nil {
		return utils.StatusError{Code: 403, Err: err}
	}

	slog.Info("userId: ", userId)

	// Get event
	events := []*models.Event{}
	result := env.GetDB().Where("creator_id = ?", userId).Find(&events)
	if result.Error != nil {
		return utils.StatusError{Code: 500, Err: result.Error}
	}

	slog.Info(fmt.Sprintf("Num events found: %d", len(events)))

	utils.JSONResponse(w, events)

	return nil
}
