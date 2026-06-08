import { describe, expect, it } from 'vitest'

import type { Match, MatchStage, MatchStatus } from './types'
import {
  groupByDay,
  selectByStage,
  selectPlayed,
  selectUpcoming,
} from './selectors'

const match = (
  id: string,
  utcDate: string,
  status: MatchStatus,
  stage: MatchStage = 'GROUP_STAGE',
): Match => ({
  id,
  utcDate,
  status,
  stage,
  group: stage === 'GROUP_STAGE' ? 'GROUP_A' : null,
  homeTeamId: 'h',
  awayTeamId: 'a',
  score: { home: null, away: null },
})

describe('selectUpcoming', () => {
  it('keeps only scheduled/timed matches, ascending by date', () => {
    const matches = [
      match('1', '2026-06-20T18:00:00Z', 'FINISHED'),
      match('2', '2026-06-12T18:00:00Z', 'TIMED'),
      match('3', '2026-06-11T18:00:00Z', 'SCHEDULED'),
    ]
    const result = selectUpcoming(matches)
    expect(result.map((m) => m.id)).toEqual(['3', '2'])
  })
})

describe('selectPlayed', () => {
  it('keeps only finished matches, descending by date', () => {
    const matches = [
      match('1', '2026-06-11T18:00:00Z', 'FINISHED'),
      match('2', '2026-06-20T18:00:00Z', 'FINISHED'),
      match('3', '2026-06-12T18:00:00Z', 'SCHEDULED'),
    ]
    const result = selectPlayed(matches)
    expect(result.map((m) => m.id)).toEqual(['2', '1'])
  })
})

describe('selectByStage', () => {
  it('filters by stage, ascending by date', () => {
    const matches = [
      match('1', '2026-07-05T18:00:00Z', 'SCHEDULED', 'QUARTER_FINALS'),
      match('2', '2026-07-04T18:00:00Z', 'SCHEDULED', 'QUARTER_FINALS'),
      match('3', '2026-06-30T18:00:00Z', 'SCHEDULED', 'ROUND_OF_16'),
    ]
    const result = selectByStage(matches, 'QUARTER_FINALS')
    expect(result.map((m) => m.id)).toEqual(['2', '1'])
  })
})

describe('groupByDay', () => {
  it('buckets matches by day in the given time zone, preserving order', () => {
    const matches = [
      match('1', '2026-06-11T18:00:00Z', 'SCHEDULED'),
      match('2', '2026-06-11T21:00:00Z', 'SCHEDULED'),
      match('3', '2026-06-12T16:00:00Z', 'SCHEDULED'),
    ]
    const days = groupByDay(matches, 'UTC')
    expect(days).toHaveLength(2)
    expect(days[0].dayKey).toBe('2026-06-11')
    expect(days[0].matches.map((m) => m.id)).toEqual(['1', '2'])
    expect(days[1].dayKey).toBe('2026-06-12')
  })

  it('splits a UTC evening across local days in a western time zone', () => {
    const matches = [
      // 02:00 UTC on the 12th = 21:00 on the 11th in New York (UTC-5)
      match('1', '2026-06-12T02:00:00Z', 'SCHEDULED'),
    ]
    const days = groupByDay(matches, 'America/New_York')
    expect(days[0].dayKey).toBe('2026-06-11')
  })
})
