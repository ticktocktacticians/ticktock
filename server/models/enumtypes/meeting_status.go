package enumtypes

import (
	"database/sql/driver"
	"fmt"
)

// Format Enum Type
type EventStatus string

const (
	PENDING_INPUT EventStatus = "PENDING_INPUT" // awaiting attendee availability input
	SCHEDULED     EventStatus = "SCHEDULED"     // event is scheduled between parties but has not started
	COMPLETED     EventStatus = "COMPLETED"
	CANCELLED     EventStatus = "CANCELLED"
)

func (status *EventStatus) Scan(value interface{}) error {
	*status = EventStatus(value.(string))
	return nil
}

func (status EventStatus) Value() (driver.Value, error) {
	return fmt.Sprint(status), nil
}
