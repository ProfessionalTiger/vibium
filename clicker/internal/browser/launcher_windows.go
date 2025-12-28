//go:build windows

package browser

import (
	"os"
	"os/exec"
)

// setProcGroup is a no-op on Windows.
func setProcGroup(cmd *exec.Cmd) {
	// Windows doesn't use process groups the same way
}

// killByPid kills a process by PID on Windows.
func killByPid(pid int) {
	proc, err := os.FindProcess(pid)
	if err == nil && proc != nil {
		proc.Kill()
	}
}
