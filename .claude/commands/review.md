Review the brightness-pilot codebase for quality issues:

1. Read all TypeScript files in src/
2. Check for:
   - Type safety issues (any assertions, missing types)
   - Error handling gaps (missing try-catch, unhandled promises)
   - Code duplication (especially spawn patterns)
   - Magic numbers or strings
   - Raycast API best practices
   - React hooks correctness (dependency arrays, cleanup)
3. Report findings with file:line references and suggested fixes
