package models

import (
	"server/models/enumtypes"
	"time"

	"github.com/google/uuid"
)

type Event struct {
	BaseModel
	ID             uint      `gorm:"primarykey"`
	Title          string    `gorm:"not null"`
	Description    *string   `gorm:"null"`
	Duration       uint32    `gorm:"not null"` // in minutes
	StartDateRange time.Time `gorm:"not null"`
	EndDateRange   time.Time `gorm:"not null"`

	// enums
	Status enumtypes.EventStatus `gorm:"type:event_status;not null"`
	Format enumtypes.Format      `gorm:"type:format;not null"`

	// associations
	CreatorID uuid.UUID `gorm:"type:uuid;not null"`
	Creator   User      `gorm:"foreignKey:creator_id;references:id;not null"`
	Attendees []User    `gorm:"many2many:event_attendees;"`
	Timeslots []Timeslot
}
