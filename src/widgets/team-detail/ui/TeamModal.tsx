import { useEffect } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { Group } from '@/entities/group'
import type { Match } from '@/entities/match'
import { getConfederation, type Team } from '@/entities/team'
import { MatchTimeline } from './MatchTimeline'

interface TeamModalProps {
  team: Team
  group: Group | undefined
  allMatches: Match[]
  teamsById: Map<string, Team>
  onClose: () => void
}

export function TeamModal({ team, group, allMatches, teamsById, onClose }: TeamModalProps) {
  const { t } = useTranslation()
  const teamName = t(`teams.${team.code}`, { defaultValue: team.name })
  const confederation = getConfederation(team.code)
  const groupLabel = group
    ? t('matches.groupLabel', { letter: group.id.trim().slice(-1).toUpperCase() })
    : undefined

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm dark:bg-black/50"
        onClick={onClose}
      />

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="relative border-b border-border bg-gradient-to-br from-muted/40 to-muted/80 px-6 py-8">
          <button
            onClick={onClose}
            aria-label={t('notFound.back')}
            className="absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground"
          >
            <X className="size-5" />
          </button>

          <div className="flex items-center gap-6">
            <img
              src={team.crest}
              alt={teamName}
              className="size-20 rounded-full border-4 border-background object-cover shadow-md sm:size-24"
            />
            <div>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{teamName}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {groupLabel && (
                  <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                    {groupLabel}
                  </span>
                )}
                {confederation && (
                  <span className="text-sm font-semibold text-muted-foreground">
                    {confederation}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-grow overflow-y-auto bg-card p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <MatchTimeline teamId={team.id} allMatches={allMatches} teamsById={teamsById} />
        </div>
      </motion.div>
    </div>
  )
}
