import { useTranslation } from 'react-i18next'

import { groupByDay, useInfiniteUpcomingMatches } from '@/entities/match'
import { selectTeamsById, useTeams } from '@/entities/team'
import { useInfiniteScroll } from '@/shared/lib/useInfiniteScroll'
import { QueryState, Skeleton } from '@/shared/ui'
import { MatchDays } from './MatchDays'

/** Upcoming fixtures, paged in on scroll via an IntersectionObserver sentinel. */
export function UpcomingMatches() {
  const { t } = useTranslation()
  const upcoming = useInfiniteUpcomingMatches()
  const teamsQuery = useTeams()

  const matches = upcoming.data?.pages.flatMap((page) => page.matches) ?? []
  const teamsById = selectTeamsById(teamsQuery.data ?? [])

  const sentinelRef = useInfiniteScroll(
    upcoming.fetchNextPage,
    upcoming.hasNextPage && !upcoming.isFetchingNextPage,
  )

  return (
    <QueryState
      isLoading={upcoming.isLoading || teamsQuery.isLoading}
      isError={upcoming.isError || teamsQuery.isError}
      isEmpty={matches.length === 0}
      emptyLabel={t('matches.empty.upcoming')}
    >
      <MatchDays days={groupByDay(matches)} teamsById={teamsById} />
      <div ref={sentinelRef} className="h-px" />
      {upcoming.isFetchingNextPage && (
        <div className="mt-4 space-y-2" aria-busy="true">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}
    </QueryState>
  )
}
