package models

import (
	"server/models/enumtypes"

	"github.com/google/uuid"
	"github.com/jackc/pgtype"
)

type Notification struct {
	BaseModel
	ID      uint         `gorm:"primarykey" json:"id"`
	Message pgtype.JSONB `gorm:"type:jsonb;default:'{}'::jsonb" json:"message"`

	// enums
	Status enumtypes.NotificationStatus `gorm:"type:notification_status;not null" json:"status"`

	// associations
	UserID  uuid.UUID `gorm:"type:uuid;not null" json:"userID"`
	User    *User     `gorm:"foreignKey:user_id;references:id;not null" json:"user,omitempty"`
	EventID uint      `gorm:"not null" json:"eventID"`
	Event   *Event    `gorm:"foreignKey:event_id;references:id;not null" json:"event,omitempty"`
}
