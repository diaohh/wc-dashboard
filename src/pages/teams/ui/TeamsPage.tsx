import { useState } from 'react'

import type { Group } from '@/entities/group'
import { useMatches } from '@/entities/match'
import { selectTeamsById, type Team, useTeams } from '@/entities/team'
import { TeamModal } from '@/widgets/team-detail'
import { TeamsGrid } from '@/widgets/team-list'

interface Selected {
  team: Team
  group: Group | undefined
}

export function TeamsPage() {
  const [selected, setSelected] = useState<Selected | null>(null)

  const matchesQuery = useMatches()
  const teamsQuery = useTeams()

  const teamsById = selectTeamsById(teamsQuery.data ?? [])

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <TeamsGrid onTeamSelect={(team, group) => setSelected({ team, group })} />
      </section>

      {selected && (
        <TeamModal
          team={selected.team}
          group={selected.group}
          allMatches={matchesQuery.data ?? []}
          teamsById={teamsById}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
