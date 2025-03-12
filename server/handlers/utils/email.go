package utils

import (
	"errors"
	"fmt"
	"log/slog"
	"os"

	"gopkg.in/gomail.v2"
)

func SendEmail(emailPayload map[string]any) error {
	// Gmail SMTP settings
	smtpServer := os.Getenv("SMTP_SERVER")
	email := os.Getenv("SMTP_EMAIL")
	password := os.Getenv("SMTP_PASSWORD")

	if smtpServer == "" || email == "" || password == "" {
		return StatusError{
			Code: 500,
			Err:  errors.New("missing SMTP configuration"),
		}
	}

	// Create email message
	m := gomail.NewMessage()
	m.SetHeader("From", "schedulr@booking.gov.sg")
	m.SetHeader("To", emailPayload["to"].([]string)...)
	m.SetHeader("Subject", emailPayload["subject"].(string))
	m.SetBody("text/html", emailPayload["html"].(string))

	slog.Info("Attempting to send email to:", emailPayload["to"])

	// Configure SMTP dialer
	d := gomail.NewDialer(smtpServer, 587, email, password)

	if err := d.DialAndSend(m); err != nil {
		return StatusError{
			Code: 500,
			Err:  fmt.Errorf("failed to send email: %v", err),
		}
	}

	return nil
}
