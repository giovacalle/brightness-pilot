# TypeScript Conventions

## Types
- Use interfaces for object shapes (Monitor, Release, CLIResult)
- Avoid `any` — use `unknown` with type guards if type is uncertain
- Avoid `as` assertions — prefer type narrowing or generics
- Export types from types.ts, co-locate component props with components

## Naming
- Interfaces: PascalCase (Monitor, MonitorListItemProps)
- Functions: camelCase (getMonitors, setBrightness)
- Constants: UPPER_SNAKE_CASE (BRIGHTNESS_STEP, SPAWN_TIMEOUT_MS)
- Files: kebab-case (get-monitors.ts, clear-cache-action.tsx)
- Components: PascalCase files (MonitorListItem.tsx)

## Error Handling
- Always parse CLI JSON output with try-catch around JSON.parse
- Return structured results { ok, data } or { ok, error } — not raw booleans
- Use showFailureToast from @raycast/utils for user-facing errors
- Log actual error details, show user-friendly messages

## Imports
- Group: external libs → @raycast → local utils → local components → types
- Use named exports, avoid default exports
