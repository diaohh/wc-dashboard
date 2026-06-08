import { useTranslation } from 'react-i18next'

import { useGroups } from '@/entities/group'
import { selectTeamsById, TeamLabel, useTeams } from '@/entities/team'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  QueryState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui'

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
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle className="text-lg">{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-6">
                      {t('matches.standings.position')}
                    </TableHead>
                    <TableHead>{t('matches.standings.team')}</TableHead>
                    <TableHead className="text-center">
                      {t('matches.standings.played')}
                    </TableHead>
                    <TableHead className="text-center">
                      {t('matches.standings.won')}
                    </TableHead>
                    <TableHead className="text-center">
                      {t('matches.standings.drawn')}
                    </TableHead>
                    <TableHead className="text-center">
                      {t('matches.standings.lost')}
                    </TableHead>
                    <TableHead className="text-center">
                      {t('matches.standings.goalDifference')}
                    </TableHead>
                    <TableHead className="text-center font-bold">
                      {t('matches.standings.points')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.standings.map((row) => (
                    <TableRow key={row.teamId}>
                      <TableCell className="text-muted-foreground tabular-nums">
                        {row.position}
                      </TableCell>
                      <TableCell>
                        <TeamLabel team={teamsById.get(row.teamId)} />
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {row.playedGames}
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {row.won}
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {row.draw}
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {row.lost}
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {row.goalDifference}
                      </TableCell>
                      <TableCell className="text-center font-bold tabular-nums">
                        {row.points}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </QueryState>
  )
}
