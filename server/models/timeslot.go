package models

import "time"

type Timeslot struct {
	BaseModel     `json:"baseModel"`
	ID            uint      `gorm:"primarykey" json:"id"`
	StartDateTime time.Time `gorm:"not null" json:"startDateTime"`
	EndDateTime   time.Time `gorm:"not null" json:"endDateTime"`

	// associations
	EventID       uint            `gorm:"not null" json:"eventID"`
	Event         *Event          `gorm:"foreignKey:event_id;references:id" json:"event,omitempty"`
	Availabilites *[]Availability `gorm:"many2many:event_timeslot_attendee_availabilities;" json:"availabilites,omitempty"`
}
