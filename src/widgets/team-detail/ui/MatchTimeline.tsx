import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { selectMatchesByTeam, type Match } from '@/entities/match'
import type { Team } from '@/entities/team'
import { useInfiniteScroll } from '@/shared/lib/useInfiniteScroll'
import { TimelineItem } from './TimelineItem'

type Filter = 'all' | 'upcoming' | 'finished'

const UPCOMING_STATUSES = new Set(['SCHEDULED', 'TIMED'])
const PAGE_SIZE = 8

interface MatchTimelineProps {
  teamId: string
  allMatches: Match[]
  teamsById: Map<string, Team>
}

export function MatchTimeline({ teamId, allMatches, teamsById }: MatchTimelineProps) {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<Filter>('all')
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)

  const filteredMatches = useMemo(() => {
    const teamMatches = selectMatchesByTeam(allMatches, teamId)
    if (filter === 'upcoming') return teamMatches.filter((m) => UPCOMING_STATUSES.has(m.status))
    if (filter === 'finished') return teamMatches.filter((m) => m.status === 'FINISHED')
    return teamMatches
  }, [allMatches, teamId, filter])

  const displayed = filteredMatches.slice(0, displayCount)
  const hasMore = displayCount < filteredMatches.length

  const sentinelRef = useInfiniteScroll<HTMLDivElement>(
    () => setDisplayCount((c) => c + PAGE_SIZE),
    hasMore,
  )

  function setFilterAndReset(f: Filter) {
    setFilter(f)
    setDisplayCount(PAGE_SIZE)
  }

  const pillClass = (active: boolean) =>
    `px-4 py-2 text-xs font-bold rounded-full transition-all ${
      active
        ? 'bg-foreground text-background'
        : 'bg-muted text-muted-foreground hover:text-foreground'
    }`

  return (
    <div>
      {/* Filter tabs */}
      <div className="sticky top-0 z-10 flex gap-2 border-b border-border bg-card pb-3">
        <button className={pillClass(filter === 'all')} onClick={() => setFilterAndReset('all')}>
          {t('teamsPage.filterAll')}
        </button>
        <button
          className={pillClass(filter === 'upcoming')}
          onClick={() => setFilterAndReset('upcoming')}
        >
          {t('teamsPage.filterUpcoming')}
        </button>
        <button
          className={pillClass(filter === 'finished')}
          onClick={() => setFilterAndReset('finished')}
        >
          {t('teamsPage.filterFinished')}
        </button>
      </div>

      {/* Timeline */}
      <div className="mt-6">
        {filteredMatches.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t('teamsPage.noMatches')}
          </p>
        ) : (
          <div className="relative space-y-4 before:absolute before:top-0 before:left-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {displayed.map((match) => (
              <TimelineItem key={match.id} match={match} teamId={teamId} teamsById={teamsById} />
            ))}
            <div ref={sentinelRef} className="h-px" />
          </div>
        )}
      </div>
    </div>
  )
}
