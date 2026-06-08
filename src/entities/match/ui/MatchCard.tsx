import { MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { formatKickoff } from '@/shared/lib/format'
import { Badge } from '@/shared/ui'
import type { Match } from '../model/types'

/** Minimal team shape needed to render a card side; `Team` satisfies it. */
interface TeamRef {
  name: string
  crest: string
  code: string
}

interface MatchCardProps {
  match: Match
  homeTeam?: TeamRef
  awayTeam?: TeamRef
}

const LIVE_STATUSES = new Set<Match['status']>(['IN_PLAY', 'PAUSED'])

export function MatchCard({ match, homeTeam, awayTeam }: MatchCardProps) {
  const { t, i18n } = useTranslation()
  const hasScore = match.score.home !== null && match.score.away !== null
  const isLive = LIVE_STATUSES.has(match.status)

  const contextLabel = match.group
    ? t('matches.groupLabel', { letter: match.group.split('_')[1] })
    : t(`matches.stage.${match.stage}`)

  return (
    <article className="group bg-card hover:border-wc-gold/40 hover:shadow-wc-gold/5 flex h-full flex-col gap-4 rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <header className="flex items-center justify-between gap-2">
        <span className="text-wc-gold truncate text-xs font-bold tracking-widest uppercase">
          {contextLabel}
        </span>
        <Badge
          variant={isLive ? 'destructive' : hasScore ? 'secondary' : 'outline'}
        >
          {t(`matches.status.${match.status}`)}
        </Badge>
      </header>

      <div className="flex items-center justify-between gap-2">
        <TeamSide team={homeTeam} />

        <div className="flex shrink-0 flex-col items-center px-1">
          {hasScore ? (
            <span className="text-2xl font-black tracking-tighter tabular-nums">
              {match.score.home}
              <span className="text-muted-foreground mx-1">-</span>
              {match.score.away}
            </span>
          ) : (
            <>
              <span className="text-xl font-black tracking-tighter tabular-nums">
                {formatKickoff(match.utcDate, i18n.language)}
              </span>
              <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                {t('matches.vs')}
              </span>
            </>
          )}
        </div>

        <TeamSide team={awayTeam} />
      </div>

      {match.venue && (
        <footer className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs font-medium">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{match.venue}</span>
        </footer>
      )}
    </article>
  )
}

function TeamSide({ team }: { team?: TeamRef }) {
  const { t } = useTranslation()

  if (!team) {
    return (
      <div className="flex flex-1 flex-col items-center gap-2">
        <div className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full border-2 border-dashed text-xs font-bold">
          ?
        </div>
        <span className="text-muted-foreground text-sm font-bold">TBD</span>
      </div>
    )
  }

  const name = t(`teams.${team.code}`, { defaultValue: team.name })

  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <img
        src={team.crest}
        alt={name}
        title={name}
        loading="lazy"
        className="border-border size-14 shrink-0 rounded-full border-2 object-cover shadow-sm transition-transform duration-300 group-hover:scale-110"
      />
      <span className="text-sm font-bold">{team.code}</span>
    </div>
  )
}
