import type { Group, Match, MatchStage, MatchStatus, Team } from './domain.js'
import type { FDMatch, FDStandingGroup, FDTeam } from './types.js'

export function buildGroupMap(
  standings: FDStandingGroup[],
): Map<number, string> {
  const map = new Map<number, string>()
  for (const standing of standings) {
    if (!standing.group) continue
    for (const row of standing.table) {
      map.set(row.team.id, standing.group)
    }
  }
  return map
}

export function mapGroups(standings: FDStandingGroup[]): Group[] {
  const groupTeams = new Map<string, number[]>()
  for (const standing of standings) {
    if (!standing.group) continue
    if (!groupTeams.has(standing.group)) groupTeams.set(standing.group, [])
    for (const row of standing.table) {
      groupTeams.get(standing.group)!.push(row.team.id)
    }
  }

  return Array.from(groupTeams.entries()).map(([groupId, teamIds]) => ({
    id: groupId,
    name: groupId.replace('_', ' ').replace(/(\w)(\w*)/g, (_, f: string, r: string) => f + r.toLowerCase()),
    teamIds: teamIds.map(String),
  }))
}

export function mapTeams(
  teams: FDTeam[],
  groupMap: Map<number, string>,
): Team[] {
  return teams.map((t) => ({
    id: String(t.id),
    name: t.name,
    shortName: t.shortName,
    code: t.tla,
    crest: t.crest,
    groupId: groupMap.get(t.id) ?? null,
  }))
}

const VALID_STATUSES = new Set<MatchStatus>([
  'SCHEDULED',
  'TIMED',
  'IN_PLAY',
  'PAUSED',
  'FINISHED',
  'POSTPONED',
  'CANCELLED',
])

const VALID_STAGES = new Set<MatchStage>([
  'GROUP_STAGE',
  'ROUND_OF_16',
  'QUARTER_FINALS',
  'SEMI_FINALS',
  'THIRD_PLACE',
  'FINAL',
])

export function mapMatches(matches: FDMatch[]): Match[] {
  return matches
    .filter(
      (m) =>
        VALID_STATUSES.has(m.status as MatchStatus) &&
        VALID_STAGES.has(m.stage as MatchStage),
    )
    .map((m) => ({
      id: String(m.id),
      utcDate: m.utcDate,
      status: m.status as MatchStatus,
      stage: m.stage as MatchStage,
      group: m.group ?? null,
      homeTeamId: String(m.homeTeam.id),
      awayTeamId: String(m.awayTeam.id),
      score: {
        home: m.score.fullTime.home,
        away: m.score.fullTime.away,
      },
    }))
}
