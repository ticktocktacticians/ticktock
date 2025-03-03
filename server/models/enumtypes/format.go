package enumtypes

import (
	"database/sql/driver"
	"fmt"
)

// Format Enum Type
type Format string

const (
	VIRTUAL  Format = "VIRTUAL"
	PHYSICAL Format = "PHYSICAL"
)

func (status *Format) Scan(value interface{}) error {
	*status = Format(value.(string))
	return nil
}

func (status Format) Value() (driver.Value, error) {
	return fmt.Sprint(status), nil
}
