# brightness-pilot

## Project Overview
- Raycast extension (TypeScript/React) for controlling display brightness on macOS
- Wraps brightness-cli Swift binary via child_process.spawn
- Downloads CLI binary from GitHub releases on first use, caches locally
- Single command "Show Monitors" — lists displays, allows brightness adjustment
- Brightness increments of 0.1 (10 steps)

## Dev Commands
```
npm install                          # install dependencies
npm run dev                          # development mode (ray develop)
npm run build                        # build extension (ray build)
npm run lint                         # lint check
npm run fix-lint                     # auto-fix lint issues
npm run publish                      # publish to Raycast Store
```

## Project Structure
```
src/
├── index.tsx                       # Main command entry (List + search + sections)
├── types.ts                        # Monitor & Release interfaces
├── components/
│   ├── MonitorListItem.tsx         # Monitor item with brightness +/- actions
│   └── ClearCacheAction.tsx        # Clear cached CLI binary action
└── utils/
    ├── cli.ts                      # CLI binary download/cache management
    ├── get-monitors.ts             # Spawns: brightness-cli detect-displays
    └── set-brightness.ts           # Spawns: brightness-cli set-brightness
```

## Architecture
- **Entry Point** (index.tsx): Raycast List with usePromise for async monitor fetching
- **Components**: MonitorListItem (brightness controls), ClearCacheAction (cache reset)
- **Utils**: CLI management (download/cache), spawn wrappers for brightness-cli
- **State**: React hooks (useState, useMemo, useRef for debounce)
- **CLI Integration**: spawn() with JSON parse, NOT exec (prevents shell injection)

## CLI Contract
- `brightness-cli detect-displays` → JSON array of Monitor objects
- `brightness-cli set-brightness <id> <brightness>` → JSON CLIResult
- Monitor: { id, name, brightness, isBuiltIn, isSupported, connectionType }
- CLIResult: { success, displayID, brightness?, error? }

## CLI Binary Management
- Binary cached at: `${environment.supportPath}/cli/brightness-cli`
- Downloaded from: `https://api.github.com/repos/giovacalle/brightness-cli/releases/latest`
- ZIP extracted, chmod 755, cached until user clears
- ClearCacheAction removes cache directory

## Dependencies
- @raycast/api (^1.100.3) — Raycast extension framework
- @raycast/utils (^1.17.0) — usePromise, showFailureToast
- extract-zip (^2.0.1) — ZIP extraction for CLI binary

## Key Conventions
- TypeScript strict mode enabled
- Double quotes (Prettier config)
- 120 char print width
- React hooks only (no class components)
- All CLI output parsed as JSON
- Brightness range: 0.0-1.0, step 0.1

## Known Issues
- set-brightness response parsed as string, not JSON (should parse CLIResult)
- Duplicate spawn/promise wrapper in get-monitors.ts and set-brightness.ts
- No spawn timeout (CLI could hang indefinitely)
- HDMI monitors show "not supported" warning (needs update after CLI HDMI support)
- Magic number 0.1 for brightness step not extracted as constant
