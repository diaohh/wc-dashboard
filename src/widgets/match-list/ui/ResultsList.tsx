import { useTranslation } from 'react-i18next'

import { groupByDay, selectPlayed, useMatches } from '@/entities/match'
import { selectTeamsById, useTeams } from '@/entities/team'
import { QueryState } from '@/shared/ui'
import { MatchDays } from './MatchDays'

/** Finished matches, newest day first. */
export function ResultsList() {
  const { t } = useTranslation()
  const matchesQuery = useMatches()
  const teamsQuery = useTeams()

  const played = selectPlayed(matchesQuery.data ?? [])
  const teamsById = selectTeamsById(teamsQuery.data ?? [])

  return (
    <QueryState
      isLoading={matchesQuery.isLoading || teamsQuery.isLoading}
      isError={matchesQuery.isError || teamsQuery.isError}
      isEmpty={played.length === 0}
      emptyLabel={t('matches.empty.results')}
    >
      <MatchDays days={groupByDay(played)} teamsById={teamsById} />
    </QueryState>
  )
}
