package models

type Booking struct {
	BaseModel
	ID uint `gorm:"primarykey"`

	// associations
	TimeslotID uint     `gorm:"not null"`
	Timeslot   Timeslot `gorm:"foreignKey:timeslot_id;references:id"`
	Attendees  []User   `gorm:"many2many:booking_attendees"`
}
