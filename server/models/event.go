package models

import (
	"server/models/enumtypes"
	"time"

	"github.com/google/uuid"
)

type Event struct {
	BaseModel      `json:"baseModel"`
	ID             uint      `gorm:"primarykey" json:"id"`
	Title          string    `gorm:"not null" json:"title"`
	Description    *string   `gorm:"null" json:"description"`
	Duration       uint32    `gorm:"not null" json:"duration"` // in minutes
	StartDateRange time.Time `gorm:"not null" json:"startDateRange"`
	EndDateRange   time.Time `gorm:"not null" json:"endDateRange"`

	// enums
	Status enumtypes.EventStatus `gorm:"type:event_status;not null" json:"status"`
	Format enumtypes.Format      `gorm:"type:format;not null" json:"format"`

	// associations
	CreatorID uuid.UUID  `gorm:"type:uuid;not null" json:"creatorID"`
	Creator   User       `gorm:"foreignKey:creator_id;references:id;not null" json:"creator"`
	Attendees []User     `gorm:"many2many:event_attendees;" json:"attendees"`
	Timeslots []Timeslot `json:"timeslots"`
}
