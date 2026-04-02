# brightness-pilot

## Project Overview
- Raycast extension (TypeScript/React) for controlling display brightness on macOS
- Wraps brightness-cli Swift binary via child_process.spawn
- Downloads CLI binary from GitHub releases on first use, caches locally
- 3 commands: Show Monitors (list), Brightness Status (menu bar), Set All Brightness (form)

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
├── index.tsx                       # Show Monitors command (List + dropdown filter)
├── menubar.tsx                     # Brightness Status command (MenuBarExtra)
├── set-all.tsx                     # Set All Brightness command (Form)
├── types.ts                        # Monitor, CLIResult, ConnectionType, Release
├── constants.ts                    # BRIGHTNESS_STEP, MIN, MAX, CLI_TIMEOUT_MS
├── components/
│   ├── MonitorListItem.tsx         # Monitor item with brightness +/- actions, connection tags
│   └── ClearCacheAction.tsx        # Clear cached CLI binary action
└── utils/
    ├── cli.ts                      # CLI binary download/cache management
    ├── spawn-cli.ts                # Unified spawn wrapper with timeout
    ├── get-monitors.ts             # Spawns: brightness-cli detect-displays
    └── set-brightness.ts           # Spawns: brightness-cli set-brightness (JSON parsed)
```

## Architecture
- **Show Monitors** (index.tsx): List with dropdown filter by connection type, sections Built-in/External
- **Brightness Status** (menubar.tsx): MenuBarExtra with per-monitor brightness controls
- **Set All Brightness** (set-all.tsx): Form with preset dropdown, parallel setBrightness
- **Components**: MonitorListItem (connection tags, brightness controls), ClearCacheAction
- **Utils**: spawn-cli.ts (unified wrapper with timeout), get-monitors, set-brightness (JSON parsed)

## CLI Contract
- `brightness-cli detect-displays` → JSON array of Monitor objects
- `brightness-cli set-brightness <id> <brightness>` → JSON CLIResult
- Monitor: { id, name, brightness, isBuiltIn, isSupported, connectionType }
- CLIResult: { success, displayID, brightness?, error? }

## CLI Binary Management
- Binary cached at: `${environment.supportPath}/cli/brightness-cli`
- Downloaded from GitHub releases API (giovacalle/brightness-cli)
- ZIP extracted, chmod 755, cached until user clears
- ClearCacheAction removes cache directory

## Dependencies
- @raycast/api (^1.100.3) — Raycast extension framework
- @raycast/utils (^1.17.0) — usePromise, showFailureToast
- extract-zip (^2.0.1) — ZIP extraction for CLI binary

## Key Conventions
- TypeScript strict mode enabled
- Double quotes (Prettier config), 120 char print width
- React hooks only (no class components)
- All CLI output parsed as JSON via spawnCli wrapper
- Brightness range: 0.0-1.0, step 0.1 (constants.ts)
- Connection types color-coded: blue (built-in), green (DP), orange (HDMI)
