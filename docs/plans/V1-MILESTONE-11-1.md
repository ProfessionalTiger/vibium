# Day 11.1: Error Types Implementation Plan

## Goal
Create typed error classes for both Go and JS to enable programmatic error handling.

## Error Types to Implement

Per V1-ROADMAP.md:
1. **ConnectionError** - Can't connect to browser/WebSocket
2. **TimeoutError** - Element not found in time (Go already has one in autowait.go)
3. **ElementNotFoundError** - Selector matched nothing
4. **BrowserCrashedError** - Browser process died

---

## Part 1: Go Errors

### File: `clicker/internal/errors/errors.go`

Create new package with typed errors:

```go
package errors

type ConnectionError struct {
    URL     string
    Cause   error
}

type TimeoutError struct {
    Selector string
    Timeout  time.Duration
    Reason   string
}

type ElementNotFoundError struct {
    Selector string
    Context  string  // browsing context ID
}

type BrowserCrashedError struct {
    ExitCode int
    Output   string
}
```

Each implements `error` interface and `Unwrap()` for error wrapping.

### Files to Update

| File | Change |
|------|--------|
| `internal/bidi/connection.go` | Use `ConnectionError` for WebSocket failures |
| `internal/bidi/element.go` | Use `ElementNotFoundError` for selector failures |
| `internal/features/autowait.go` | Move `TimeoutError` to errors package |
| `internal/browser/launcher.go` | Use `TimeoutError` for chromedriver startup |
| `internal/clicker/process.go` | Use `BrowserCrashedError` for process exit |

---

## Part 2: JS Errors

### File: `clients/javascript/src/utils/errors.ts`

Create custom error classes:

```typescript
export class ConnectionError extends Error {
  constructor(public url: string, public cause?: Error) {
    super(`Failed to connect to ${url}`);
    this.name = 'ConnectionError';
  }
}

export class TimeoutError extends Error {
  constructor(public selector: string, public timeout: number, public reason?: string) {
    super(`Timeout waiting for element: ${selector}`);
    this.name = 'TimeoutError';
  }
}

export class ElementNotFoundError extends Error {
  constructor(public selector: string) {
    super(`Element not found: ${selector}`);
    this.name = 'ElementNotFoundError';
  }
}

export class BrowserCrashedError extends Error {
  constructor(public exitCode: number, public output?: string) {
    super(`Browser crashed with exit code ${exitCode}`);
    this.name = 'BrowserCrashedError';
  }
}
```

### Files to Update

| File | Change |
|------|--------|
| `src/index.ts` | Export error types |
| `src/bidi/connection.ts` | Use `ConnectionError` |
| `src/element.ts` | Use `ElementNotFoundError` |
| `src/vibe.ts` | Use `TimeoutError` for find() timeout |
| `src/clicker/process.ts` | Use `BrowserCrashedError` |

---

## Implementation Order

1. Create Go `internal/errors/errors.go`
2. Update Go files to use new errors
3. Create JS `src/utils/errors.ts`
4. Update JS files to use new errors
5. Export errors from `src/index.ts`
6. Run tests to verify nothing breaks

---

## Checkpoint

After implementation:
```bash
# Build should pass
make build

# Tests should pass
make test
```

Error types should be usable in client code:
```typescript
import { TimeoutError, ElementNotFoundError } from 'vibium';

try {
  await vibe.find('.missing');
} catch (e) {
  if (e instanceof TimeoutError) {
    console.log(`Timed out after ${e.timeout}ms`);
  }
}
```
