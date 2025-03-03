package models

import (
	"server/models/enumtypes"

	"github.com/google/uuid"
	"github.com/jackc/pgtype"
)

type Notification struct {
	BaseModel
	ID      uint         `gorm:"primarykey"`
	Message pgtype.JSONB `gorm:"type:jsonb;default:'{}'::jsonb"`

	// enums
	Status enumtypes.NotificationStatus `gorm:"type:notification_status;not null"`

	// associations
	UserID  uuid.UUID `gorm:"type:uuid;not null"`
	User    User      `gorm:"foreignKey:user_id;references:id;not null"`
	EventID uint      `gorm:"not null"`
	Event   Event     `gorm:"foreignKey:event_id;references:id;not null"`
}
