/**
 * Locale- and timezone-aware formatting for match timestamps.
 * Matches carry a UTC ISO date; we always render in the user's locale/timezone.
 */

export function formatKickoff(utcDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(utcDate))
}

export function formatDayHeading(utcDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(utcDate))
}
