//go:build !windows

package process

import (
	"os"
	"os/exec"
	"os/signal"
	"syscall"

	"github.com/vibium/clicker/internal/log"
)

// killProcess kills a process and its children on Unix systems.
func killProcess(cmd *exec.Cmd) {
	if cmd.Process != nil {
		// Kill the entire process group to get all child processes
		pgid, err := syscall.Getpgid(cmd.Process.Pid)
		if err == nil {
			syscall.Kill(-pgid, syscall.SIGKILL)
		} else {
			cmd.Process.Kill()
		}
	}
}

// setupSignalNotify sets up signal notification for Unix signals.
func setupSignalNotify(c chan os.Signal) {
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
}

// WithCleanup wraps a function with panic recovery that ensures browser cleanup.
func WithCleanup(fn func()) {
	defer func() {
		if r := recover(); r != nil {
			log.Error("panic recovered, cleaning up browsers", "panic", r)
			KillAll()
			panic(r)
		}
	}()
	fn()
}
