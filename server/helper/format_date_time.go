package helper

import (
	"log/slog"
	"time"
)

// Helper function to format UTC date time into date
// eg 2025-03-09 01:00:00+00 -> 9 March 2025
func FormatDate(dateTime time.Time) string {
	loc, _ := time.LoadLocation("Asia/Singapore")
	t := dateTime.In(loc)
	slog.Info("Formatted Date: ", t.Format("2 January 2006"))
	return t.Format("2 January 2006")
}

// Helper function to format UTC date time into date
// eg 2025-03-09 01:00:00+00 -> 1 AM
func FormatTime(dateTime time.Time) string {
	loc, _ := time.LoadLocation("Asia/Singapore")
	t := dateTime.In(loc)
	slog.Info("Formatted Time: ", t.Format(time.Kitchen))
	return t.Format(time.Kitchen)
}
