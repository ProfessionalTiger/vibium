# Day 11.3: Graceful Shutdown Implementation Plan

## Goal
Ensure all exit scenarios clean up Chrome processes properly.

## Current State

**Already working:**
- ✅ Normal exit - defers in main.go close browsers
- ✅ SIGINT/SIGTERM - SetupSignalHandler() and WaitForSignal() in process.go
- ✅ Client disconnect - OnClientDisconnect() in proxy/router.go
- ✅ Process tree cleanup - killProcessTree() in browser/launcher.go

**Gaps:**
- ❌ Panic recovery - no recover() blocks
- ⚠️ Context usage - inconsistent across commands

## Implementation

### 1. Add Panic Recovery

Add recover() wrapper to ensure cleanup even on panics.

**File: `internal/process/process.go`**
```go
// WithCleanup wraps a function with panic recovery that ensures cleanup.
func WithCleanup(fn func()) {
    defer func() {
        if r := recover(); r != nil {
            log.Error("panic recovered, cleaning up", "panic", r)
            KillAll()
            panic(r) // re-panic after cleanup
        }
    }()
    fn()
}
```

### 2. Use Recovery in Commands

**File: `cmd/clicker/main.go`**

Wrap command Run functions:
```go
Run: func(cmd *cobra.Command, args []string) {
    process.WithCleanup(func() {
        // existing code
    })
}
```

Apply to commands that launch browsers:
- navigate
- screenshot
- eval
- find
- click
- type
- check-actionable
- serve
- mcp

### 3. Add Context to MCP Server

**File: `internal/mcp/server.go`**

Add context for cancellation:
```go
func (s *Server) RunWithContext(ctx context.Context) error {
    // Check context in read loop
}
```

---

## Checkpoint

Already verified by existing tests:
```bash
make test  # Includes process cleanup tests
```

Manual verification:
```bash
# Test SIGTERM on serve
./bin/clicker serve &
kill -TERM $!
ps aux | grep -i chrome  # Should be empty

# Test Ctrl+C on mcp
./bin/clicker mcp
# Press Ctrl+C
ps aux | grep -i chrome  # Should be empty
```

---

## Files to Modify

| File | Change |
|------|--------|
| `internal/process/process.go` | Add WithCleanup() |
| `cmd/clicker/main.go` | Wrap browser commands with WithCleanup |
