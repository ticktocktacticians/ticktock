package models

import (
	"github.com/google/uuid"
)

type User struct {
	BaseModel
	ID    uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()" json:"id"`
	Email string    `json:"email"`
	Alias string    `json:"alias"`
}
