package enumtypes

import (
	"database/sql/driver"
	"fmt"
)

// Format Enum Type
type NotificationStatus string

const (
	SUCCESS NotificationStatus = "SUCCESS"
	FAIL    NotificationStatus = "FAIL"
)

func (status *NotificationStatus) Scan(value interface{}) error {
	*status = NotificationStatus(value.(string))
	return nil
}

func (status NotificationStatus) Value() (driver.Value, error) {
	return fmt.Sprint(status), nil
}
