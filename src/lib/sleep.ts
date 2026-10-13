import { SleepEntry } from '../types';

export const MAX_SLEEP_MINUTES = 16 * 60;

// Date = day sleep started. Wake rolls to the next day when it is not after the sleep time.
export function buildRange(date: Date, sleepTime: Date, wakeTime: Date) {
  const start = new Date(date);
  start.setHours(sleepTime.getHours(), sleepTime.getMinutes(), 0, 0);
  const end = new Date(date);
  end.setHours(wakeTime.getHours(), wakeTime.getMinutes(), 0, 0);
  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }
  return { start, end };
}

export function durationMinutes({ start, end }: Pick<SleepEntry, 'start' | 'end'>) {
  return Math.round((end.getTime() - start.getTime()) / 60000);
}

export function formatDuration(minutes: number) {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function formatDay(date: Date) {
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

type WeekInfo = { firstDay: number }; // 1 = Monday ... 7 = Sunday
type LocaleWithWeekInfo = Intl.Locale & { weekInfo?: WeekInfo; getWeekInfo?: () => WeekInfo };

function firstDayOfWeek() {
  try {
    const locale = new Intl.Locale(Intl.DateTimeFormat().resolvedOptions().locale) as LocaleWithWeekInfo;
    const info = locale.getWeekInfo?.() ?? locale.weekInfo;
    if (info) return info.firstDay % 7; // 0 = Sunday ... 6 = Saturday
  } catch {
    // Intl.Locale unavailable: fall through
  }
  return 0;
}

export function isThisWeek(date: Date, now = new Date()) {
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() - firstDayOfWeek() + 7) % 7));
  return date >= weekStart;
}

export function formatDateRange(entries: Pick<SleepEntry, 'start'>[]) {
  const times = entries.map((e) => e.start.getTime());
  const first = new Date(Math.min(...times));
  const last = new Date(Math.max(...times));
  const short = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (first.toDateString() === last.toDateString()) return short(first);
  if (first.getMonth() === last.getMonth()) return `${short(first)} – ${last.getDate()}`;
  return `${short(first)} – ${short(last)}`;
}
