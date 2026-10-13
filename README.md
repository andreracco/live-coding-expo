# Sleeplog

Mobile app (React Native + Expo + TypeScript) where a parent logs their infant's sleep and gets an AI-written weekly summary.

Built with Claude Code assistance.

## Features

**Log tab**
- Scrollable list of sleep entries (date, time range, duration bar, optional note), grouped into "This Week" and "Older"; the latest entry is highlighted.
- Empty state and an always-visible add button.
- Bottom sheet form: date, sleep time, wake time, optional note.
  - Date is the night sleep started; wake time rolls to the next day when it is not after the sleep time.
  - Save is blocked for future starts, equal sleep/wake times, and sleeps longer than 16h.
- In-memory state only (no persistence).

**Analysis tab**
- Sends this week's entries to the Anthropic Messages API (`claude-sonnet-4-6`) with plain `fetch`, no HTTP library.
- Loading (progress bar + skeletons), result (summary, four key stats, tip) and error (with Retry) states.
- Only re-requests when this week's entries changed since the last successful analysis.

## Run

```bash
npm install
cp .env.example .env.local   # then set EXPO_PUBLIC_ANTHROPIC_API_KEY
npx expo start
```

Restart `expo start` after changing `.env.local`; Expo inlines `EXPO_PUBLIC_*` values at bundle time. Without a key the Analysis tab shows a "Missing API key" error.

## Structure

```
src/app/          routes (Expo Router tabs: index = Log, analysis = Analysis)
src/components/   Log UI (EntryCard, EmptyState, AddEntrySheet) and analysis/ UI
src/context/      EntriesContext (shared in-memory entries)
src/lib/          sleep.ts (date/duration helpers), analysis.ts (API call + parsing)
```

## Known trade-offs

- **API key is client-side.** Any `EXPO_PUBLIC_*` value ends up in the app bundle and can be extracted. Fine for a demo; for production, call the API through a backend proxy that holds the key and fixes the model, prompt and `max_tokens`.
- **Stats come from the model.** Durations are sent precomputed, but the returned stats are not cross-checked locally.
- **No icon library.** Tab and button icons are emoji/text glyphs; installing `@expo/vector-icons` hit an npm peer-dependency conflict.
- **Lint not set up.** `npx expo lint` tries to install ESLint and hits the same conflict; type checking is `npx tsc --noEmit`.
- Sheet closes via Cancel or backdrop tap (no drag-to-dismiss). No edit/delete, and overlapping entries are not checked.
