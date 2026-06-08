import { useTranslation } from 'react-i18next'

import {
  KNOCKOUT_STAGES,
  MatchCard,
  selectByStage,
  useMatches,
} from '@/entities/match'
import { selectTeamsById, useTeams } from '@/entities/team'
import { QueryState } from '@/shared/ui'

/** Knockout rounds laid out as columns (no connector lines yet). */
export function KnockoutBracket() {
  const { t } = useTranslation()
  const matchesQuery = useMatches()
  const teamsQuery = useTeams()

  const all = matchesQuery.data ?? []
  const teamsById = selectTeamsById(teamsQuery.data ?? [])
  const columns = KNOCKOUT_STAGES.map((stage) => ({
    stage,
    matches: selectByStage(all, stage),
  })).filter((column) => column.matches.length > 0)

  return (
    <QueryState
      isLoading={matchesQuery.isLoading || teamsQuery.isLoading}
      isError={matchesQuery.isError || teamsQuery.isError}
      isEmpty={columns.length === 0}
      emptyLabel={t('matches.empty.bracket')}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <section key={column.stage} className="w-72 shrink-0 space-y-3">
            <h2 className="text-sm font-semibold">
              {t(`matches.stage.${column.stage}`)}
            </h2>
            <div className="space-y-3">
              {column.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  homeTeam={teamsById.get(match.homeTeamId)}
                  awayTeam={teamsById.get(match.awayTeamId)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </QueryState>
  )
}
