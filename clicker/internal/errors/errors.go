// Package errors provides typed error types for the clicker library.
package errors

import (
	"fmt"
	"time"
)

// ConnectionError is returned when a connection to the browser fails.
type ConnectionError struct {
	URL   string
	Cause error
}

func (e *ConnectionError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("failed to connect to %s: %v", e.URL, e.Cause)
	}
	return fmt.Sprintf("failed to connect to %s", e.URL)
}

func (e *ConnectionError) Unwrap() error {
	return e.Cause
}

// TimeoutError is returned when a wait operation times out.
type TimeoutError struct {
	Selector string
	Timeout  time.Duration
	Reason   string
}

func (e *TimeoutError) Error() string {
	if e.Reason != "" {
		return fmt.Sprintf("timeout after %s waiting for '%s': %s", e.Timeout, e.Selector, e.Reason)
	}
	return fmt.Sprintf("timeout after %s waiting for '%s'", e.Timeout, e.Selector)
}

// ElementNotFoundError is returned when a selector matches no elements.
type ElementNotFoundError struct {
	Selector string
	Context  string // browsing context ID
}

func (e *ElementNotFoundError) Error() string {
	if e.Context != "" {
		return fmt.Sprintf("element not found: %s (context: %s)", e.Selector, e.Context)
	}
	return fmt.Sprintf("element not found: %s", e.Selector)
}

// BrowserCrashedError is returned when the browser process dies unexpectedly.
type BrowserCrashedError struct {
	ExitCode int
	Output   string
}

func (e *BrowserCrashedError) Error() string {
	if e.Output != "" {
		return fmt.Sprintf("browser crashed with exit code %d: %s", e.ExitCode, e.Output)
	}
	return fmt.Sprintf("browser crashed with exit code %d", e.ExitCode)
}
