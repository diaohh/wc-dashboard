/**
 * Locale- and timezone-aware formatting for match timestamps.
 * Matches carry a UTC ISO date; we always render in the user's locale/timezone.
 */

export function formatKickoff(utcDate: string, locale: string): string {
  const parts = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(new Date(utcDate))

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''

  const period = value('dayPeriod').toLowerCase().startsWith('a')
    ? 'A.M.'
    : 'P.M.'

  return `${value('hour')}:${value('minute')} ${period}`
}

export function formatDayHeading(utcDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(utcDate))
}
