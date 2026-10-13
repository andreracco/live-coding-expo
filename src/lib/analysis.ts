import { SleepEntry } from '../types';
import { durationMinutes, formatDay, formatTime } from './sleep';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

export type Stat = { label: string; value: string; detail: string };
export type Analysis = { summary: string; stats: Stat[]; tip: string };

export class AnalysisError extends Error {}

const SYSTEM_PROMPT = `You summarize an infant's sleep log for a parent. Be warm, calm and plain-spoken. Do not give medical advice or diagnose anything.
Respond with ONLY a JSON object (no markdown, no code fences) of this exact shape:
{"summary": string, "stats": [{"label": string, "value": string, "detail": string}], "tip": string}
- "summary": 2-4 sentences describing the week's pattern.
- "stats": exactly 4 items, in this order and with these labels: "Longest sleep", "Shortest sleep", "Avg duration", "Avg bedtime". "value" is short (e.g. "9h 45m" or "9:10 pm"); "detail" is very short (e.g. "Sat, Apr 26" or "this week").
- "tip": one actionable, encouraging suggestion for the parent.
Use the durations provided; do not recompute them.`;

function describeEntries(entries: SleepEntry[]) {
  return entries
    .map((e) => {
      const note = e.note ? `, note: ${e.note}` : '';
      return `${formatDay(e.start)}: slept ${formatTime(e.start)}, woke ${formatTime(e.end)}, ${durationMinutes(e)} minutes${note}`;
    })
    .join('\n');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStat(value: unknown): value is Stat {
  return (
    isRecord(value) &&
    typeof value.label === 'string' &&
    typeof value.value === 'string' &&
    typeof value.detail === 'string'
  );
}

function parseAnalysis(text: string): Analysis {
  const json = text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new AnalysisError('The analysis came back in an unexpected format. Please try again.');
  }
  if (
    !isRecord(data) ||
    typeof data.summary !== 'string' ||
    typeof data.tip !== 'string' ||
    !Array.isArray(data.stats) ||
    data.stats.length < 2 ||
    !data.stats.every(isStat)
  ) {
    throw new AnalysisError('The analysis came back incomplete. Please try again.');
  }
  return { summary: data.summary, stats: data.stats, tip: data.tip };
}

function errorForStatus(status: number) {
  if (status === 401 || status === 403) return 'The API key was rejected. Check the key in .env.local.';
  if (status === 429) return 'Too many requests right now. Please wait a moment and retry.';
  return `The analysis service returned an error (${status}). Please try again.`;
}

export async function analyzeEntries(entries: SleepEntry[], signal: AbortSignal): Promise<Analysis> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AnalysisError('Missing API key. Set EXPO_PUBLIC_ANTHROPIC_API_KEY in .env.local and restart.');
  }

  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Baby: Mia, 4 months old. Sleep log for this week:\n${describeEntries(entries)}`,
          },
        ],
      }),
    });
  } catch {
    if (signal.aborted) throw new AnalysisError('Cancelled');
    throw new AnalysisError('Could not reach the analysis service. Check your connection and retry.');
  }

  if (!response.ok) throw new AnalysisError(errorForStatus(response.status));

  const body: unknown = await response.json();
  const first = isRecord(body) && Array.isArray(body.content) ? body.content[0] : undefined;
  if (!isRecord(first) || typeof first.text !== 'string') {
    throw new AnalysisError('The analysis came back empty. Please try again.');
  }
  return parseAnalysis(first.text);
}
