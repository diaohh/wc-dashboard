import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

import type { Team } from '@/entities/team'

interface TeamCardProps {
  team: Team
  groupLabel: string | undefined
  animationDelay: number
  onClick: () => void
}

export function TeamCard({ team, groupLabel, animationDelay, onClick }: TeamCardProps) {
  const { t } = useTranslation()
  const name = t(`teams.${team.code}`, { defaultValue: team.name })

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
      onClick={onClick}
      className="group bg-card flex cursor-pointer flex-col items-center rounded-2xl border border-border p-5 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-wc-gold/40 hover:shadow-xl"
    >
      <div className="relative mb-4 size-16 sm:size-20">
        <div className="absolute inset-0 scale-110 rounded-full bg-muted transition-colors duration-300 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/30" />
        <img
          src={team.crest}
          alt={name}
          loading="lazy"
          className="relative size-full rounded-full border-2 border-background object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="text-balance text-center text-sm font-bold leading-tight transition-colors group-hover:text-wc-gold sm:text-base">
        {name}
      </h3>
      {groupLabel && (
        <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {groupLabel}
        </span>
      )}
    </motion.article>
  )
}
