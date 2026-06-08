import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

import { MatchCard, type MatchDay } from '@/entities/match'
import type { Team } from '@/entities/team'
import { formatDayHeading } from '@/shared/lib/format'

interface MatchDaysProps {
  days: MatchDay[]
  teamsById: Map<string, Team>
}

/** Presentational day-sectioned list of match cards. */
export function MatchDays({ days, teamsById }: MatchDaysProps) {
  const { i18n } = useTranslation()

  return (
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
  )
}
