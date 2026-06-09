import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

import { useGroups, type Standing } from '@/entities/group'
import { selectTeamsById, useTeams, type Team } from '@/entities/team'
import { cn } from '@/shared/lib/utils'
import { QueryState } from '@/shared/ui'

export function GroupStandings() {
  const { t } = useTranslation()
  const groupsQuery = useGroups()
  const teamsQuery = useTeams()

  const groups = groupsQuery.data ?? []
  const teamsById = selectTeamsById(teamsQuery.data ?? [])

  return (
    <QueryState
      isLoading={groupsQuery.isLoading || teamsQuery.isLoading}
      isError={groupsQuery.isError || teamsQuery.isError}
      isEmpty={groups.length === 0}
    >
      <div className="text-muted-foreground mb-6 flex flex-wrap items-center gap-4 text-xs font-bold tracking-wider uppercase">
        <Legend className="bg-emerald-500" label={t('matches.legend.win')} />
        <Legend className="bg-blue-500" label={t('matches.legend.draw')} />
        <Legend className="bg-red-500" label={t('matches.legend.loss')} />
        <Legend
          className="bg-muted-foreground/30"
          label={t('matches.legend.pending')}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((group, index) => (
          <motion.article
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: Math.min(index * 0.05, 0.4),
              ease: [0.16, 1, 0.3, 1],
            }}
            className="bg-card overflow-hidden rounded-3xl border shadow-sm transition-shadow duration-300 hover:shadow-xl"
          >
            <header className="from-muted/60 border-b bg-gradient-to-r to-transparent px-5 py-4">
              <h3 className="text-lg font-black tracking-tight">
                {t('matches.groupLabel', {
                  letter: group.id.trim().slice(-1).toUpperCase(),
                })}
              </h3>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-muted-foreground border-b text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 font-semibold tracking-wider">
                      {t('matches.standings.team')}
                    </th>
                    <th className="px-2 py-3 text-center font-semibold">
                      {t('matches.standings.played')}
                    </th>
                    <th className="hidden px-2 py-3 text-center font-semibold sm:table-cell">
                      {t('matches.standings.goalDifference')}
                    </th>
                    <th className="hidden px-2 py-3 text-center font-semibold md:table-cell">
                      {t('matches.standings.form')}
                    </th>
                    <th className="text-foreground px-5 py-3 text-center text-base font-black">
                      {t('matches.standings.points')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.standings.map((row) => (
                    <StandingRow
                      key={row.teamId}
                      row={row}
                      team={teamsById.get(row.teamId)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.article>
        ))}
      </div>
    </QueryState>
  )
}

function StandingRow({ row, team }: { row: Standing; team?: Team }) {
  const { t } = useTranslation()
  const qualifying = row.position <= 2
  const name = team ? t(`teams.${team.code}`, { defaultValue: team.name }) : '—'
  const gd =
    row.goalDifference > 0
      ? `+${row.goalDifference}`
      : String(row.goalDifference)

  return (
    <tr
      className={cn(
        'group border-b transition-colors last:border-0',
        qualifying ? 'bg-wc-gold/10 hover:bg-wc-gold/20' : 'hover:bg-muted/50',
      )}
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'w-4 text-right text-sm font-bold tabular-nums',
              qualifying ? 'text-wc-gold' : 'text-muted-foreground',
            )}
          >
            {row.position}
          </span>
          {team && (
            <img
              src={team.crest}
              alt=""
              loading="lazy"
              className="border-border size-8 shrink-0 rounded-full border object-cover shadow-sm transition-transform duration-300 group-hover:scale-110"
            />
          )}
          <span
            className={cn(
              'truncate font-bold',
              !qualifying && 'text-muted-foreground',
            )}
          >
            {name}
          </span>
        </div>
      </td>
      <td className="text-muted-foreground px-2 py-3.5 text-center tabular-nums">
        {row.playedGames}
      </td>
      <td className="text-muted-foreground hidden px-2 py-3.5 text-center tabular-nums sm:table-cell">
        {gd}
      </td>
      <td className="hidden px-2 py-3.5 md:table-cell">
        <FormDots form={row.form} />
      </td>
      <td className="px-5 py-3.5 text-center text-lg font-black tabular-nums">
        {row.points}
      </td>
    </tr>
  )
}

// Each team plays 3 group matches; show a dot per match (gray = not played yet).
const GROUP_MATCHES = 3

function FormDots({ form }: { form: string | null }) {
  const results = (form ?? '')
    .split(',')
    .map((result) => result.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, GROUP_MATCHES)

  const dots = Array.from(
    { length: GROUP_MATCHES },
    (_, index) => results[index] ?? null,
  )

  return (
    <div className="flex justify-center gap-1">
      {dots.map((result, index) => (
        <span
          key={index}
          className={cn(
            'size-2.5 rounded-full',
            result === 'W'
              ? 'bg-emerald-500'
              : result === 'L'
                ? 'bg-red-500'
                : result === 'D'
                  ? 'bg-blue-500'
                  : 'bg-muted-foreground/30',
          )}
        />
      ))}
    </div>
  )
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('size-2 rounded-full', className)} />
      {label}
    </span>
  )
}
