import { useTranslation } from 'react-i18next'

import { formatKickoff } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui'
import type { Match } from '../model/types'

/** Minimal team shape needed to render a card side; `Team` satisfies it. */
interface TeamRef {
  name: string
  crest: string
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

  return (
    <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
      <TeamSide team={homeTeam} reversed />
      <div className="flex shrink-0 flex-col items-center gap-1">
        {hasScore ? (
          <span className="text-lg font-bold tabular-nums">
            {match.score.home}&nbsp;-&nbsp;{match.score.away}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm tabular-nums">
            {formatKickoff(match.utcDate, i18n.language)}
          </span>
        )}
        <Badge
          variant={isLive ? 'destructive' : hasScore ? 'secondary' : 'outline'}
        >
          {t(`matches.status.${match.status}`)}
        </Badge>
      </div>
      <TeamSide team={awayTeam} />
    </div>
  )
}

function TeamSide({ team, reversed }: { team?: TeamRef; reversed?: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-1 items-center gap-2 overflow-hidden',
        reversed ? 'flex-row-reverse text-right' : 'text-left',
      )}
    >
      {team ? (
        <>
          <img
            src={team.crest}
            alt=""
            className="size-6 shrink-0 object-contain"
            loading="lazy"
          />
          <span className="truncate text-sm font-medium">{team.name}</span>
        </>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      )}
    </div>
  )
}
