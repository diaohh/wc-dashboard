import type { Match, MatchStage } from './types'

const UPCOMING_STATUSES = new Set<Match['status']>(['SCHEDULED', 'TIMED'])

/** Knockout rounds in bracket order, for column layout. */
export const KNOCKOUT_STAGES: MatchStage[] = [
  'ROUND_OF_16',
  'QUARTER_FINALS',
  'SEMI_FINALS',
  'THIRD_PLACE',
  'FINAL',
]

export function selectUpcoming(matches: Match[]): Match[] {
  return matches
    .filter((m) => UPCOMING_STATUSES.has(m.status))
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
}

export function selectPlayed(matches: Match[]): Match[] {
  return matches
    .filter((m) => m.status === 'FINISHED')
    .sort((a, b) => b.utcDate.localeCompare(a.utcDate))
}

export function selectByStage(matches: Match[], stage: MatchStage): Match[] {
  return matches
    .filter((m) => m.stage === stage)
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
}

export interface MatchDay {
  dayKey: string
  matches: Match[]
}

/**
 * Group matches by calendar day in the given time zone (defaults to runtime
 * local). Preserves input order, so days inherit the caller's sort direction.
 */
export function groupByDay(matches: Match[], timeZone?: string): MatchDay[] {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const byDay = new Map<string, Match[]>()
  for (const match of matches) {
    const dayKey = fmt.format(new Date(match.utcDate))
    const bucket = byDay.get(dayKey)
    if (bucket) bucket.push(match)
    else byDay.set(dayKey, [match])
  }

  return Array.from(byDay.entries()).map(([dayKey, dayMatches]) => ({
    dayKey,
    matches: dayMatches,
  }))
}
