import type {
  Group,
  Match,
  MatchStage,
  MatchStatus,
  Standing,
  Team,
} from './domain.js'
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

function titleCase(groupId: string): string {
  // "GROUP_A" or "Group A" → "Group A"
  return groupId
    .split(/[_\s]+/)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function mapGroups(standings: FDStandingGroup[]): Group[] {
  return standings
    .filter((standing) => standing.group)
    .map((standing) => {
      const rows: Standing[] = standing.table.map((row) => ({
        teamId: String(row.team.id),
        position: row.position,
        playedGames: row.playedGames,
        won: row.won,
        draw: row.draw,
        lost: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        goalDifference: row.goalDifference,
        points: row.points,
        form: row.form ?? null,
      }))

      return {
        id: standing.group!,
        name: titleCase(standing.group!),
        teamIds: rows.map((r) => r.teamId),
        standings: rows,
      }
    })
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
  'LAST_32',
  'LAST_16',
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
      venue: m.venue ?? null,
      homeTeamId: String(m.homeTeam.id),
      awayTeamId: String(m.awayTeam.id),
      score: {
        home: m.score.fullTime.home,
        away: m.score.fullTime.away,
      },
    }))
}
