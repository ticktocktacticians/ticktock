package models

import (
	"github.com/google/uuid"
)

type User struct {
	BaseModel
	ID    uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()" json:"id"`
	Email string    `json:"email"`
	Alias string    `json:"alias"`

	// associations
	Availabilities []Availability `gorm:"foreignKey:attendee_id"`
	Events         []*Event       `gorm:"many2many:event_attendees"`
	Bookings       []*Booking     `gorm:"many2many:booking_attendees"`
}
