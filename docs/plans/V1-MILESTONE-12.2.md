# Milestone 12.2-12.4: NPM Packaging Plan

## Overview

Create npm packages for distributing Vibium:
- **Main package**: `vibium` (user installs this)
- **Platform packages**: `@vibium/linux-x64`, `@vibium/darwin-arm64`, etc. (auto-installed as optional deps)

Pattern follows [esbuild's approach](https://www.npmjs.com/package/@esbuild/linux-x64).

---

## Package Structure

```
packages/
├── vibium/                    # Main package (npm: vibium)
│   ├── package.json
│   ├── index.js               # Re-exports clients/javascript
│   ├── bin.js                 # npx vibium → runs clicker mcp
│   └── postinstall.js         # Runs clicker install (downloads Chrome)
│
├── linux-x64/                 # Platform package (npm: @vibium/linux-x64)
│   ├── package.json
│   └── bin/clicker
├── linux-arm64/               # npm: @vibium/linux-arm64
├── darwin-x64/                # npm: @vibium/darwin-x64
├── darwin-arm64/              # npm: @vibium/darwin-arm64
└── win32-x64/                 # npm: @vibium/win32-x64
    └── bin/clicker.exe
```

---

## Milestone 12.2: Platform Packages

### Create 5 platform packages:

| Directory | npm name | os | cpu | Binary source |
|-----------|----------|-----|-----|---------------|
| `packages/linux-x64/` | `@vibium/linux-x64` | linux | x64 | `clicker-linux-amd64` |
| `packages/linux-arm64/` | `@vibium/linux-arm64` | linux | arm64 | `clicker-linux-arm64` |
| `packages/darwin-x64/` | `@vibium/darwin-x64` | darwin | x64 | `clicker-darwin-amd64` |
| `packages/darwin-arm64/` | `@vibium/darwin-arm64` | darwin | arm64 | `clicker-darwin-arm64` |
| `packages/win32-x64/` | `@vibium/win32-x64` | win32 | x64 | `clicker-windows-amd64.exe` |

### Platform package.json template:
```json
{
  "name": "@vibium/linux-x64",
  "version": "0.1.0",
  "description": "Vibium clicker binary for Linux x64",
  "os": ["linux"],
  "cpu": ["x64"],
  "main": "bin/clicker",
  "files": ["bin"],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/VibiumDev/vibium.git"
  }
}
```

### Build script (add to Makefile):
- `make package-platforms` - copies binaries to packages/*/bin/

---

## Milestone 12.3: Main Package

### packages/vibium/package.json:
```json
{
  "name": "vibium",
  "version": "0.1.0",
  "description": "Browser automation for AI agents and humans",
  "main": "./index.js",
  "bin": {
    "vibium": "./bin.js"
  },
  "scripts": {
    "postinstall": "node postinstall.js"
  },
  "optionalDependencies": {
    "@vibium/linux-x64": "0.1.0",
    "@vibium/linux-arm64": "0.1.0",
    "@vibium/darwin-x64": "0.1.0",
    "@vibium/darwin-arm64": "0.1.0",
    "@vibium/win32-x64": "0.1.0"
  },
  "files": ["index.js", "bin.js", "postinstall.js", "dist"],
  "license": "MIT"
}
```

### packages/vibium/index.js:
- Re-exports from clients/javascript/dist
- `export { browser, browserSync } from './dist/index.js'`

### packages/vibium/bin.js:
- Finds clicker binary from optional deps
- Execs `clicker mcp` for stdio MCP server

### packages/vibium/postinstall.js:
- Runs `clicker install` to download Chrome for Testing
- Respects VIBIUM_SKIP_BROWSER_DOWNLOAD=1

---

## Milestone 12.4: Makefile Targets

Add to Makefile:
```makefile
# Copy binaries to platform packages
package-platforms: build-all-platforms
	mkdir -p packages/linux-x64/bin packages/linux-arm64/bin ...
	cp clicker/bin/clicker-linux-amd64 packages/linux-x64/bin/clicker
	...

# Build main package (copy JS dist)
package-main: build-js
	cp -r clients/javascript/dist packages/vibium/dist
```

---

## NPM Publishing

See [How to Publish Vibium to npm](../how-to-guides/npm-publishing.md)

---

## Verification Checkpoints

1. **After 12.2**: `ls packages/*/bin/` shows all binaries
2. **After 12.3**: `cd packages/vibium && npm pack` creates tarball
3. **After 12.4**:
   ```bash
   npm install ./packages/vibium/vibium-0.1.0.tgz
   npx vibium  # Should start MCP server
   ```
