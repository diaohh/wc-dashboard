import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'

import {
  groupByDay,
  MatchCard,
  selectPlayed,
  selectUpcoming,
  useMatches,
} from '@/entities/match'
import { selectTeamsById, useTeams } from '@/entities/team'
import { formatDayHeading } from '@/shared/lib/format'
import { QueryState } from '@/shared/ui'

interface MatchListProps {
  variant: 'upcoming' | 'results'
}

/** Self-contained day-sectioned list of matches for the upcoming/results views. */
export function MatchList({ variant }: MatchListProps) {
  const { t, i18n } = useTranslation()
  const matchesQuery = useMatches()
  const teamsQuery = useTeams()

  const all = matchesQuery.data ?? []
  const selected =
    variant === 'upcoming' ? selectUpcoming(all) : selectPlayed(all)
  const teamsById = selectTeamsById(teamsQuery.data ?? [])
  const days = groupByDay(selected)

  return (
    <QueryState
      isLoading={matchesQuery.isLoading || teamsQuery.isLoading}
      isError={matchesQuery.isError || teamsQuery.isError}
      isEmpty={selected.length === 0}
      emptyLabel={t(`matches.empty.${variant}`)}
    >
      <div className="space-y-8">
        {days.map((day) => (
          <section key={day.dayKey} className="space-y-3">
            <h2 className="text-muted-foreground text-sm font-semibold capitalize">
              {formatDayHeading(day.matches[0].utcDate, i18n.language)}
            </h2>
            <ul className="space-y-2">
              {day.matches.map((match, index) => (
                <motion.li
                  key={match.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                >
                  <MatchCard
                    match={match}
                    homeTeam={teamsById.get(match.homeTeamId)}
                    awayTeam={teamsById.get(match.awayTeamId)}
                  />
                </motion.li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </QueryState>
  )
}
