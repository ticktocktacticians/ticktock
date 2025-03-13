package models

import "github.com/google/uuid"

type Availability struct {
	BaseModel
	ID uint `gorm:"primarykey" json:"id"`

	// associations
	AttendeeID uuid.UUID   `gorm:"type:uuid;not null" json:"attendeeID"`
	Attendee   *User       `gorm:"foreignKey:attendee_id;references:id" json:"attendee,omitempty"`
	Timeslots  *[]Timeslot `gorm:"many2many:event_timeslot_attendee_availabilities;" json:"timeslots,omitempty"`
}
