import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Check } from 'lucide-react'

import { selectTeamsById, useTeams } from '@/entities/team'
import { selectUpcoming, useMatches } from '@/entities/match'
import { generateICS, downloadICS } from '../api/calendar'

type ExportState = 'idle' | 'done'

const APP_URL = import.meta.env.VITE_APP_URL as string | undefined

export function SyncButton() {
  const { t } = useTranslation()
  const matchesQuery = useMatches()
  const teamsQuery = useTeams()
  const [state, setState] = useState<ExportState>('idle')

  function handleClick() {
    if (APP_URL) {
      // Production: open Google Calendar subscription dialog
      const webcalUrl = `webcal://${APP_URL.replace(/^https?:\/\//, '')}/calendar.ics`
      const gcalUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl)}`
      window.open(gcalUrl, '_blank', 'noopener,noreferrer')
    } else {
      // Dev fallback: generate and download ICS locally
      const upcoming = selectUpcoming(matchesQuery.data ?? [])
      const teamsById = selectTeamsById(teamsQuery.data ?? [])
      downloadICS(generateICS(upcoming, teamsById))
    }

    setState('done')
    setTimeout(() => setState('idle'), 3000)
  }

  const isLoading = !APP_URL && (matchesQuery.isLoading || teamsQuery.isLoading)

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || state === 'done'}
      className="group flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-muted-foreground shadow-sm transition-all duration-300 hover:border-wc-gold hover:bg-wc-gold/10 hover:text-wc-gold hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {state === 'done' ? (
        <>
          <Check className="size-4 text-green-500" />
          {t('calendar.added')}
        </>
      ) : (
        <>
          <Calendar className="size-4 transition-transform duration-300 group-hover:scale-110" />
          {t('calendar.add')}
        </>
      )}
    </button>
  )
}
