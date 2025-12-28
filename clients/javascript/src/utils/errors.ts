/**
 * Custom error types for the Vibium client library.
 */

/**
 * ConnectionError is thrown when connecting to the browser fails.
 */
export class ConnectionError extends Error {
  constructor(
    public url: string,
    public cause?: Error
  ) {
    super(cause ? `Failed to connect to ${url}: ${cause.message}` : `Failed to connect to ${url}`);
    this.name = 'ConnectionError';
  }
}

/**
 * TimeoutError is thrown when a wait operation times out.
 */
export class TimeoutError extends Error {
  constructor(
    public selector: string,
    public timeout: number,
    public reason?: string
  ) {
    const msg = reason
      ? `Timeout after ${timeout}ms waiting for '${selector}': ${reason}`
      : `Timeout after ${timeout}ms waiting for '${selector}'`;
    super(msg);
    this.name = 'TimeoutError';
  }
}

/**
 * ElementNotFoundError is thrown when a selector matches no elements.
 */
export class ElementNotFoundError extends Error {
  constructor(public selector: string) {
    super(`Element not found: ${selector}`);
    this.name = 'ElementNotFoundError';
  }
}

/**
 * BrowserCrashedError is thrown when the browser process dies unexpectedly.
 */
export class BrowserCrashedError extends Error {
  constructor(
    public exitCode: number,
    public output?: string
  ) {
    const msg = output
      ? `Browser crashed with exit code ${exitCode}: ${output}`
      : `Browser crashed with exit code ${exitCode}`;
    super(msg);
    this.name = 'BrowserCrashedError';
  }
}
