import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/utils'
import type { Team } from '../model/types'

interface TeamLabelProps {
  team: Team | undefined
  className?: string
}

/** Crest + name for a single team. Renders a dash when the team is unknown. */
export function TeamLabel({ team, className }: TeamLabelProps) {
  const { t } = useTranslation()

  if (!team) {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <span className={cn('flex items-center gap-2', className)}>
      <img
        src={team.crest}
        alt=""
        className="size-5 shrink-0 object-contain"
        loading="lazy"
      />
      <span className="truncate font-medium">
        {t(`teams.${team.code}`, { defaultValue: team.name })}
      </span>
    </span>
  )
}
