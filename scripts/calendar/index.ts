import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import type { Match, Team } from '../sync/domain.js'
import esLocale from '../../src/shared/config/i18n/locales/es.json' with { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))

const FIFA_TO_ISO2: Record<string, string> = {
  ALG: 'DZ', ARG: 'AR', AUS: 'AU', AUT: 'AT', BEL: 'BE',
  BIH: 'BA', BRA: 'BR', CAN: 'CA', CIV: 'CI', COD: 'CD',
  COL: 'CO', CPV: 'CV', CRO: 'HR', CUW: 'CW', CZE: 'CZ',
  ECU: 'EC', EGY: 'EG', ESP: 'ES', FRA: 'FR', GER: 'DE',
  GHA: 'GH', HAI: 'HT', IRN: 'IR', IRQ: 'IQ', JOR: 'JO',
  JPN: 'JP', KOR: 'KR', KSA: 'SA', MAR: 'MA', MEX: 'MX',
  NED: 'NL', NOR: 'NO', NZL: 'NZ', PAN: 'PA', PAR: 'PY',
  POR: 'PT', QAT: 'QA', RSA: 'ZA', SEN: 'SN', SUI: 'CH',
  SWE: 'SE', TUN: 'TN', TUR: 'TR', URY: 'UY', USA: 'US', UZB: 'UZ',
}

const FLAG_OVERRIDES: Record<string, string> = {
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
}

function getFlag(code: string): string {
  if (FLAG_OVERRIDES[code]) return FLAG_OVERRIDES[code]
  const iso2 = FIFA_TO_ISO2[code]
  if (!iso2) return ''
  return [...iso2].map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join('')
}

function escapeICS(str: string): string {
  return str.replace(/[\\,;]/g, '\\$&').replace(/\r?\n/g, '\\n')
}

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

const UPCOMING = new Set(['SCHEDULED', 'TIMED'])

async function run() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT is not set')
  initializeApp({ credential: cert(JSON.parse(raw) as Parameters<typeof cert>[0]) })
  const db = getFirestore()

  console.log('Reading teams and matches from Firestore…')
  const [teamsSnap, matchesSnap] = await Promise.all([
    db.collection('teams').get(),
    db.collection('matches').get(),
  ])

  const teams = teamsSnap.docs.map((d) => d.data() as Team)
  const matches = matchesSnap.docs.map((d) => d.data() as Match)
  const teamsById = new Map(teams.map((t) => [t.id, t]))

  const upcoming = matches
    .filter((m) => UPCOMING.has(m.status))
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate))

  const events = upcoming
    .map((match) => {
      const home = teamsById.get(match.homeTeamId)
      const away = teamsById.get(match.awayTeamId)
      if (!home || !away) return null

      const homeName = esLocale.teams[home.code as keyof typeof esLocale.teams] ?? home.name
      const awayName = esLocale.teams[away.code as keyof typeof esLocale.teams] ?? away.name
      const start = new Date(match.utcDate)
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
      const context = match.group
        ? `Grupo ${match.group.trim().slice(-1).toUpperCase()}`
        : match.stage.replace(/_/g, ' ')

      return [
        'BEGIN:VEVENT',
        `UID:wc2026-match-${match.id}@wc2026-dashboard`,
        `DTSTART:${formatICSDate(start)}`,
        `DTEND:${formatICSDate(end)}`,
        `SUMMARY:${escapeICS(`${getFlag(home.code)} ${homeName} vs ${getFlag(away.code)} ${awayName}`)}`,
        `DESCRIPTION:${escapeICS(`FIFA World Cup 2026 · ${context}`)}`,
        match.venue ? `LOCATION:${escapeICS(match.venue)}` : '',
        'END:VEVENT',
      ]
        .filter(Boolean)
        .join('\r\n')
    })
    .filter((e): e is string => e !== null)
    .join('\r\n')

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WC2026 Dashboard//EN',
    'X-WR-CALNAME:FIFA World Cup 2026',
    'X-WR-TIMEZONE:UTC',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    events,
    'END:VCALENDAR',
  ].join('\r\n')

  const outPath = resolve(__dirname, '../../public/calendar.ics')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, ics, 'utf-8')

  const count = upcoming.filter(
    (m) => teamsById.has(m.homeTeamId) && teamsById.has(m.awayTeamId),
  ).length
  console.log(`✓ Wrote ${count} events to public/calendar.ics`)
}

run().catch((err: unknown) => {
  console.error('Calendar generation failed:', err)
  process.exit(1)
})
