# brightness-pilot

## Project Overview

- Raycast extension for controlling display brightness on macOS.
- Wraps the `brightness-cli` Swift binary via `child_process.spawn`.
- Downloads the CLI binary from GitHub Releases on first use and caches it locally.
- Main commands: Show Monitors, Brightness Status, Set All Brightness, Night Shift controls.

## Dev Commands

```sh
npm install
npm run dev
npm run build
npm run lint
npm run fix-lint
npm run publish
```

`npm run build` and `npm run lint` require the Raycast `ray` CLI to be available.

## Project Structure

```text
src/
├── index.tsx
├── menubar.tsx
├── set-all.tsx
├── types.ts
├── constants.ts
├── components/
│   ├── MonitorListItem.tsx
│   └── ClearCacheAction.tsx
└── utils/
    ├── cli.ts
    ├── spawn-cli.ts
    ├── get-monitors.ts
    ├── night-shift.ts
    └── set-brightness.ts
```

## Architecture

- `index.tsx` renders the monitor list and filters.
- `menubar.tsx` renders the menu bar status UI.
- `set-all.tsx` applies one brightness value to supported monitors.
- `components/` contains reusable Raycast UI pieces.
- `utils/cli.ts` manages CLI binary download/cache.
- `utils/spawn-cli.ts` is the unified spawn wrapper with timeout handling.
- `utils/get-monitors.ts` and `utils/set-brightness.ts` parse CLI JSON output.

## CLI Contract

- `brightness-cli detect-displays` returns a JSON array of `Monitor` objects.
- `brightness-cli set-brightness <id> <brightness>` returns a JSON `CLIResult`.
- Existing monitor fields: `id`, `name`, `brightness`, `isBuiltIn`, `isSupported`, `connectionType`.
- Newer CLI versions may also return `brightnessControl` with structured hardware-control diagnostics.
- Treat unknown additive fields as non-breaking.
- Use `isSupported` for whether brightness actions should be shown.
- Use `brightnessControl.reasonCode` / `message` for clearer unsupported-state UI.

## CLI Binary Management

- Binary cache path: `${environment.supportPath}/cli/brightness-cli`.
- Release API: `https://api.github.com/repos/giovacalle/brightness-cli/releases/latest`.
- Downloaded ZIP is extracted, `chmod 755` is applied, and the binary remains cached until cleared.
- `ClearCacheAction` removes the cache directory.

## Conventions

- TypeScript strict mode is enabled.
- Use double quotes and the existing Prettier/Raycast formatting.
- Keep CLI parsing centralized in `utils/`.
- Brightness range is `0.0...1.0`; UI step is defined in `constants.ts`.
- Avoid showing brightness actions for unsupported monitors.
- Prefer stable machine-readable reason codes over parsing user-facing messages.
