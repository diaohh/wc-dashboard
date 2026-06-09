import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'

import { type Group, useGroups } from '@/entities/group'
import { type Team, useTeams } from '@/entities/team'
import { useDebounce } from '@/shared/lib/useDebounce'
import { QueryState, Skeleton } from '@/shared/ui'
import { TeamCard } from './TeamCard'

interface TeamsGridProps {
  onTeamSelect: (team: Team, group: Group | undefined) => void
}

const loadingSkeleton = (
  <div
    className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-6"
    aria-busy="true"
  >
    {Array.from({ length: 12 }, (_, i) => (
      <Skeleton key={i} className="h-36 rounded-2xl" />
    ))}
  </div>
)

export function TeamsGrid({ onTeamSelect }: TeamsGridProps) {
  const { t } = useTranslation()
  const teamsQuery = useTeams()
  const groupsQuery = useGroups()

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const groupsById = useMemo(
    () => new Map((groupsQuery.data ?? []).map((g) => [g.id, g])),
    [groupsQuery.data],
  )

  const filteredTeams = useMemo(() => {
    const teams = teamsQuery.data ?? []
    if (!debouncedQuery.trim()) return teams
    const q = debouncedQuery.toLowerCase()
    return teams.filter((team) => {
      const localName = t(`teams.${team.code}`, { defaultValue: team.name }).toLowerCase()
      return (
        localName.includes(q) ||
        team.name.toLowerCase().includes(q) ||
        team.code.toLowerCase().includes(q)
      )
    })
  }, [teamsQuery.data, debouncedQuery, t])

  return (
    <div>
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">{t('teamsPage.title')}</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {t('teamsPage.subtitle')}
          </p>
        </div>

        <div className="group relative w-full md:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="size-5 text-muted-foreground transition-colors group-focus-within:text-wc-gold" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('teamsPage.searchPlaceholder')}
            className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-12 text-sm font-medium shadow-sm placeholder:text-muted-foreground focus:border-wc-gold focus:ring-4 focus:ring-wc-gold/10 focus:outline-none"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="rounded border border-border px-1.5 py-0.5 text-xs font-bold text-muted-foreground">
              ⌘K
            </span>
          </div>
        </div>
      </div>

      <QueryState
        isLoading={teamsQuery.isLoading || groupsQuery.isLoading}
        isError={teamsQuery.isError || groupsQuery.isError}
        isEmpty={filteredTeams.length === 0}
        emptyLabel={t('teamsPage.noResults')}
        loadingFallback={loadingSkeleton}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
          {filteredTeams.map((team, index) => {
            const group = team.groupId ? groupsById.get(team.groupId) : undefined
            const groupLabel = group
              ? t('matches.groupLabel', { letter: group.id.trim().slice(-1).toUpperCase() })
              : undefined
            return (
              <TeamCard
                key={team.id}
                team={team}
                groupLabel={groupLabel}
                animationDelay={Math.min(index * 0.03, 0.5)}
                onClick={() => onTeamSelect(team, group)}
              />
            )
          })}
        </div>
      </QueryState>
    </div>
  )
}
