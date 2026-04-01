# Raycast Extension Patterns

## Hooks
- Use usePromise from @raycast/utils for async data fetching
- Use useRef for debounce/lock flags (not useState — avoids re-renders)
- Memoize derived state with useMemo (e.g., filtered monitors)
- Clean up effects properly in useEffect return

## Components
- List with sections for categorized items (Built-in / External)
- Action.Panel for context menu actions (Increase, Decrease, Clear Cache)
- EmptyView for no-data and error states
- Toast for feedback (success, failure, progress)

## CLI Integration
- Use child_process.spawn (NOT exec) — prevents shell injection
- Pass arguments as array, not concatenated string
- Parse stdout as JSON, handle stderr separately
- Add timeout to prevent hanging processes

## State Management
- Keep state minimal — derive what you can
- Update parent state via callbacks (setMonitors)
- Optimistic UI: update local state immediately, revalidate on error

## Performance
- Cache CLI binary in Raycast support directory
- Don't re-download binary on every invocation
- Debounce rapid brightness changes
