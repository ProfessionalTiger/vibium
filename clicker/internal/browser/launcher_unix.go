//go:build !windows

package browser

import (
	"os/exec"
	"syscall"
)

// setProcGroup sets the process group for the command (Unix only).
func setProcGroup(cmd *exec.Cmd) {
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
}

// killByPid sends SIGKILL to a process by PID.
func killByPid(pid int) {
	syscall.Kill(pid, syscall.SIGKILL)
}
