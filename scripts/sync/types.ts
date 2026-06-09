// football-data.org v4 API response shapes

export interface FDTeam {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
}

export interface FDTeamsResponse {
  teams: FDTeam[]
}

export interface FDStandingRow {
  position: number
  team: Pick<FDTeam, 'id'>
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  form: string | null
}

export interface FDStandingGroup {
  stage: string
  type: string
  group: string | null
  table: FDStandingRow[]
}

export interface FDStandingsResponse {
  standings: FDStandingGroup[]
}

export interface FDScore {
  winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null
  fullTime: { home: number | null; away: number | null }
}

export interface FDMatch {
  id: number
  utcDate: string
  status: string
  stage: string
  group: string | null
  venue: string | null
  homeTeam: Pick<FDTeam, 'id'>
  awayTeam: Pick<FDTeam, 'id'>
  score: FDScore
}

export interface FDMatchesResponse {
  matches: FDMatch[]
}
