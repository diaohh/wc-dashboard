import { useState } from 'react'
import { Maximize2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

import {
  selectByStage,
  useMatches,
  type Match,
  type MatchStage,
} from '@/entities/match'
import { selectTeamsById, useTeams, type Team } from '@/entities/team'
import { cn } from '@/shared/lib/utils'
import { useDragScroll } from '@/shared/lib/useDragScroll'
import { QueryState } from '@/shared/ui'

const ROUNDS: { stage: MatchStage; slots: number }[] = [
  { stage: 'LAST_32', slots: 16 },
  { stage: 'LAST_16', slots: 8 },
  { stage: 'QUARTER_FINALS', slots: 4 },
  { stage: 'SEMI_FINALS', slots: 2 },
  { stage: 'FINAL', slots: 1 },
]

/** Connected knockout bracket; empty slots render as TBD until the draw fills. */
export function KnockoutBracket() {
  const { t } = useTranslation()
  const matchesQuery = useMatches()
  const teamsQuery = useTeams()
  const scrollRef = useDragScroll<HTMLDivElement>()

  const all = matchesQuery.data ?? []
  const teamsById = selectTeamsById(teamsQuery.data ?? [])
  const thirdPlace = selectByStage(all, 'THIRD_PLACE')[0] ?? null

  return (
    <QueryState
      isLoading={matchesQuery.isLoading || teamsQuery.isLoading}
      isError={matchesQuery.isError || teamsQuery.isError}
      isEmpty={all.length === 0}
      emptyLabel={t('matches.empty.bracket')}
    >
      <div
        ref={scrollRef}
        className="cursor-grab overflow-x-auto pb-4 select-none"
      >
        <div className="flex min-w-max gap-8">
          {ROUNDS.map((round, roundIndex) => {
            const stageMatches = selectByStage(all, round.stage)
            const slots = Array.from(
              { length: round.slots },
              (_, i) => stageMatches[i] ?? null,
            )
            const connected = roundIndex < ROUNDS.length - 1

            return (
              <motion.div
                key={round.stage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: roundIndex * 0.1, duration: 0.5 }}
                className="flex flex-col"
              >
                <h3 className="text-muted-foreground mb-4 text-center text-xs font-black tracking-widest uppercase">
                  {t(`matches.stage.${round.stage}`)}
                </h3>
                <div
                  className={cn(
                    'bracket-round flex-1',
                    connected && 'bracket-round--connected',
                  )}
                >
                  {slots.map((match, i) => (
                    <div
                      key={match?.id ?? `${round.stage}-${i}`}
                      className="bracket-seed"
                    >
                      <BracketSeed match={match} teamsById={teamsById} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {thirdPlace && (
        <div className="mt-10">
          <h3 className="text-muted-foreground mb-3 text-xs font-black tracking-widest uppercase">
            {t('matches.stage.THIRD_PLACE')}
          </h3>
          <BracketSeed match={thirdPlace} teamsById={teamsById} />
        </div>
      )}
    </QueryState>
  )
}

function BracketSeed({
  match,
  teamsById,
}: {
  match: Match | null
  teamsById: Map<string, Team>
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const home = match ? teamsById.get(match.homeTeamId) : undefined
  const away = match ? teamsById.get(match.awayTeamId) : undefined
  const finished =
    !!match &&
    match.status === 'FINISHED' &&
    match.score.home !== null &&
    match.score.away !== null
  const homeWon = finished && match!.score.home! > match!.score.away!
  const awayWon = finished && match!.score.away! > match!.score.home!

  return (
    <div className="relative">
      <button
        type="button"
        onClick={match ? () => setExpanded((value) => !value) : undefined}
        disabled={!match}
        className={cn(
          'bg-card group relative flex w-40 items-center justify-center gap-2 rounded-xl border p-2.5 shadow-sm transition-all duration-300',
          match
            ? 'hover:border-wc-gold/50 cursor-pointer hover:-translate-y-0.5 hover:shadow-md'
            : 'border-dashed',
        )}
      >
        <Crest team={home} won={homeWon} />
        <span className="text-muted-foreground shrink-0 text-[10px] font-black uppercase">
          {t('matches.vs')}
        </span>
        <Crest team={away} won={awayWon} />
        {match && (
          <Maximize2 className="text-muted-foreground/30 group-hover:text-wc-gold absolute top-1.5 right-1.5 size-3 transition-colors" />
        )}
      </button>

      {match && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-1/2 left-1/2 z-30 w-60 -translate-x-1/2 -translate-y-1/2"
            >
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="border-wc-gold/50 bg-card block w-full cursor-pointer overflow-hidden rounded-xl border-2 text-left shadow-xl"
              >
                <TeamRow
                  team={home}
                  score={match.score.home}
                  won={homeWon}
                  dim={finished && !homeWon}
                  divider
                />
                <TeamRow
                  team={away}
                  score={match.score.away}
                  won={awayWon}
                  dim={finished && !awayWon}
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

function Crest({ team, won }: { team?: Team; won: boolean }) {
  const { t } = useTranslation()
  const name = team
    ? t(`teams.${team.code}`, { defaultValue: team.name })
    : undefined

  return team ? (
    <img
      src={team.crest}
      alt={name}
      title={name}
      loading="lazy"
      className={cn(
        'border-border size-10 rounded-full border object-cover transition-transform duration-300 group-hover:scale-105',
        won && 'ring-wc-gold ring-2',
      )}
    />
  ) : (
    <span className="bg-muted border-border size-10 rounded-full border border-dashed" />
  )
}

function TeamRow({
  team,
  score,
  won,
  dim,
  divider,
}: {
  team?: Team
  score: number | null
  won: boolean
  dim: boolean
  divider?: boolean
}) {
  const { t } = useTranslation()
  const name = team
    ? t(`teams.${team.code}`, { defaultValue: team.name })
    : null

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 p-2.5 transition-opacity',
        divider && 'border-b',
        won && 'bg-wc-gold/10',
        dim && 'opacity-50',
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        {team ? (
          <img
            src={team.crest}
            alt=""
            loading="lazy"
            className="border-border size-6 shrink-0 rounded-full border object-cover"
          />
        ) : (
          <span className="bg-muted border-border size-6 shrink-0 rounded-full border" />
        )}
        <span
          className={cn(
            'truncate text-sm',
            won ? 'font-black' : 'font-medium',
            !team && 'text-muted-foreground',
          )}
        >
          {team ? (name ?? team.code) : t('matches.tbd')}
        </span>
      </div>
      {score !== null && (
        <span
          className={cn(
            'shrink-0 text-sm tabular-nums',
            won ? 'font-black' : 'text-muted-foreground font-bold',
          )}
        >
          {score}
        </span>
      )}
    </div>
  )
}
