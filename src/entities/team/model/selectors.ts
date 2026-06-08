import type { Team } from './types'

/** Index teams by id for joining into matches and standings. */
export function selectTeamsById(teams: Team[]): Map<string, Team> {
  return new Map(teams.map((team) => [team.id, team]))
}
