# CLI Integration Guidelines

## CLI Contract
The extension communicates with brightness-cli via JSON:

### detect-displays
- Command: `brightness-cli detect-displays`
- Output: JSON array of Display objects
- Fields: id (number), name (string), brightness (number|null), isBuiltIn (boolean), isSupported (boolean), connectionType (string)

### set-brightness
- Command: `brightness-cli set-brightness <displayID> <brightness>`
- Output: JSON CLIResult object
- Fields: success (boolean), displayID (number), brightness (number|null), error (string|null)

## Parsing Rules
- Always JSON.parse with try-catch
- Validate parsed object has expected fields
- Handle null brightness (unsupported displays)
- Check CLIResult.success before treating as success

## Spawn Rules
- Use spawn, not exec
- Arguments as string array: ["set-brightness", id.toString(), brightness.toString()]
- Validate inputs before spawning (id >= 0, 0.0 <= brightness <= 1.0)
- Set timeout (5s recommended)
- Handle exit code !== 0 as error

## Binary Management
- Binary location: ${environment.supportPath}/cli/brightness-cli
- Download from GitHub releases API
- Cache until user explicitly clears
- Verify binary exists and is executable before spawn
