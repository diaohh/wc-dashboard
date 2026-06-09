// Firestore document shapes — mirrors src/entities/*/model/types.ts
// Kept separate so the sync script has no dependency on src/

export type MatchStatus =
  | 'SCHEDULED'
  | 'TIMED'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'POSTPONED'
  | 'CANCELLED'

export type MatchStage =
  | 'GROUP_STAGE'
  | 'LAST_32'
  | 'LAST_16'
  | 'QUARTER_FINALS'
  | 'SEMI_FINALS'
  | 'THIRD_PLACE'
  | 'FINAL'

export interface Match {
  id: string
  utcDate: string
  status: MatchStatus
  stage: MatchStage
  group: string | null
  venue: string | null
  homeTeamId: string
  awayTeamId: string
  score: { home: number | null; away: number | null }
}

export interface Team {
  id: string
  name: string
  shortName: string
  code: string
  crest: string
  groupId: string | null
}

export interface Standing {
  teamId: string
  position: number
  playedGames: number
  won: number
  draw: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: string | null
}

export interface Group {
  id: string
  name: string
  teamIds: string[]
  standings: Standing[]
}
