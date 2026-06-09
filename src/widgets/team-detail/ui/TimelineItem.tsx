import { Calendar, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { Match } from '@/entities/match'
import type { Team } from '@/entities/team'
import { formatDayHeading, formatKickoff } from '@/shared/lib/format'

interface TimelineItemProps {
  match: Match
  teamId: string
  teamsById: Map<string, Team>
}

export function TimelineItem({ match, teamId, teamsById }: TimelineItemProps) {
  const { t, i18n } = useTranslation()
  const isFinished = match.status === 'FINISHED'
  const hasScore = match.score.home !== null && match.score.away !== null

  const homeTeam = teamsById.get(match.homeTeamId)
  const awayTeam = teamsById.get(match.awayTeamId)

  const contextLabel = match.group
    ? t('matches.groupLabel', { letter: match.group.trim().slice(-1).toUpperCase() })
    : t(`matches.stage.${match.stage}`)

  return (
    <div className="relative flex items-center gap-4">
      {/* Timeline dot */}
      <div
        className={`z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-4 border-background shadow ${
          isFinished
            ? 'bg-emerald-500 text-white'
            : 'border-wc-gold bg-card text-wc-gold'
        }`}
      >
        {isFinished ? (
          <Check className="size-4" strokeWidth={3} />
        ) : (
          <Calendar className="size-4" />
        )}
      </div>

      {/* Match card */}
      <div
        className={`flex-1 rounded-2xl border p-4 transition-colors ${
          isFinished
            ? 'border-border bg-muted/40'
            : 'border-border bg-card shadow-sm hover:border-wc-gold/40 hover:shadow-md'
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {formatDayHeading(match.utcDate, i18n.language)} · {contextLabel}
          </span>
          {isFinished ? (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {t('matches.status.FINISHED')}
            </span>
          ) : (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
              {t('matches.status.SCHEDULED')}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <TeamSide team={homeTeam} isSubject={match.homeTeamId === teamId} />

          <div className="rounded-lg border border-border bg-background px-3 py-1 text-sm font-black tracking-widest">
            {isFinished && hasScore
              ? `${match.score.home} – ${match.score.away}`
              : formatKickoff(match.utcDate, i18n.language)}
          </div>

          <TeamSide team={awayTeam} isSubject={match.awayTeamId === teamId} reverse />
        </div>
      </div>
    </div>
  )
}

function TeamSide({
  team,
  isSubject,
  reverse = false,
}: {
  team: Team | undefined
  isSubject: boolean
  reverse?: boolean
}) {
  if (!team) {
    return (
      <div className={`flex items-center gap-2 ${reverse ? 'flex-row-reverse' : ''}`}>
        <div className="flex size-6 items-center justify-center rounded-full border border-dashed border-border bg-muted text-[8px] font-bold text-muted-foreground">
          ?
        </div>
        <span className="text-xs font-bold text-muted-foreground">TBD</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${reverse ? 'flex-row-reverse' : ''}`}>
      <img src={team.crest} alt={team.code} className="size-6 rounded-full object-cover" />
      <span
        className={`text-xs font-bold ${isSubject ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        {team.code}
      </span>
    </div>
  )
}
