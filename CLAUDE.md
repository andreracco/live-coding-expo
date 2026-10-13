# Live Coding Guidelines

This is a React Native + Expo + TypeScript live-coding project.

## Priorities

1. Correctness
2. Simplicity
3. Readability
4. Type safety
5. React Native best practices
6. Performance where relevant

## Working Style

- Prefer the simplest solution that satisfies the current requirements.
- Do not overengineer or create abstractions prematurely.
- Do not add dependencies unless there is a clear reason.
- Prefer small, focused components.
- Keep state close to where it is used.
- Avoid `any`; use proper TypeScript types.
- Consider iOS and Android behavior.
- Consider accessibility for interactive elements.

## AI Behavior

- Do not implement requirements that were not requested.
- When requirements are ambiguous, point them out rather than guessing.
- Explain meaningful architectural decisions.
- Before large changes, propose the approach first.
- When reviewing code, identify bugs and edge cases instead of rewriting everything.
- Preserve existing working behavior when modifying code.