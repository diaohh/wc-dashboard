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
