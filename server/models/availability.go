package models

import "github.com/google/uuid"

type Availability struct {
	BaseModel
	ID uint `gorm:"primarykey"`

	// associations
	AttendeeID uuid.UUID   `gorm:"type:uuid;not null"`
	Attendee   User        `gorm:"foreignKey:attendee_id;references:id"`
	Timeslots  []*Timeslot `gorm:"many2many:event_timeslot_attendee_availabilities;"`
}
