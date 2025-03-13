package models

type Booking struct {
	BaseModel
	ID uint `gorm:"primarykey" json:"id"`

	// associations
	TimeslotID uint      `gorm:"not null" json:"timeslotID"`
	Timeslot   *Timeslot `gorm:"foreignKey:timeslot_id;references:id" json:"timeslot,omitempty"`
	Attendees  *[]User   `gorm:"many2many:booking_attendees" json:"attendees,omitempty"`
}
