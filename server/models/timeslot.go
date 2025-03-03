package models

import "time"

type Timeslot struct {
	BaseModel
	ID            uint      `gorm:"primarykey"`
	StartDateTime time.Time `gorm:"not null"`
	EndDateTime   time.Time `gorm:"not null"`

	// associations
	EventID       uint            `gorm:"not null"`
	Event         Event           `gorm:"foreignKey:event_id;references:id"`
	Availabilites []*Availability `gorm:"many2many:event_timeslot_attendee_availabilities;"`
}
