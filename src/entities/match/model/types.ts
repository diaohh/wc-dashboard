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
  homeTeamId: string
  awayTeamId: string
  score: {
    home: number | null
    away: number | null
  }
}
