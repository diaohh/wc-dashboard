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
}

export interface Group {
  id: string
  name: string
  teamIds: string[]
  standings: Standing[]
}
