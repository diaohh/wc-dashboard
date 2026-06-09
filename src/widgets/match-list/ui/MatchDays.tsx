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
    <div className="space-y-10">
      {days.map((day) => (
        <section key={day.dayKey} className="space-y-5">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black tracking-tight capitalize">
              {formatDayHeading(day.matches[0].utcDate, i18n.language)}
            </h2>
            <div className="from-border h-px flex-grow bg-gradient-to-r to-transparent" />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {day.matches.map((match, index) => (
              <motion.li
                key={match.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(index * 0.04, 0.4),
                  ease: [0.16, 1, 0.3, 1],
                }}
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
