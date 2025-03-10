package helper

import (
	"encoding/base64"
)

// Created this encoder and decoder so that i can generate a unique link for the user to access the scheduler
// For example, the link could be: http://localhost:8080/schedule/SGVsbG8sIEdvIQ==
// The link is generated by encoding the email;eventId pair (e.g. ticktocktacticians@gmail.com;1)

// EncodeBase64 encodes a string to Base64 without special characters
func EncodeBase64(input string) string {
	return base64.RawURLEncoding.EncodeToString([]byte(input))
}

// DecodeBase64 decodes a Base64 URL-encoded string
func DecodeBase64(encoded string) (string, error) {
	decodedBytes, err := base64.RawURLEncoding.DecodeString(encoded)
	if err != nil {
		return "", err
	}
	return string(decodedBytes), nil
}
