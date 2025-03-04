package helper

import (
	"testing"
)

func TestEncodeBase64(t *testing.T) {
	original := "Hello, Go!"
	expected := "SGVsbG8sIEdvIQ=="
	encoded := EncodeBase64(original)
	if encoded != expected {
		t.Errorf("EncodeBase64(%s) = %s; want %s", original, encoded, expected)
	}
}

func TestDecodeBase64(t *testing.T) {
	encoded := "SGVsbG8sIEdvIQ=="
	expected := "Hello, Go!"
	decoded, err := DecodeBase64(encoded)
	if err != nil {
		t.Errorf("DecodeBase64(%s) returned error: %v", encoded, err)
	}
	if decoded != expected {
		t.Errorf("DecodeBase64(%s) = %s; want %s", encoded, decoded, expected)
	}
}

func TestDecodeBase64InvalidInput(t *testing.T) {
	invalidEncoded := "InvalidBase64"
	_, err := DecodeBase64(invalidEncoded)
	if err == nil {
		t.Errorf("DecodeBase64(%s) expected error but got none", invalidEncoded)
	}
}
