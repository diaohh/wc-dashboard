import type { Match } from '@/entities/match'
import type { Team } from '@/entities/team'
import esLocale from '@/shared/config/i18n/locales/es.json'

// FIFA 3-letter → ISO 3166-1 alpha-2 for flag emoji generation
const FIFA_TO_ISO2: Record<string, string> = {
  ALG: 'DZ', ARG: 'AR', AUS: 'AU', AUT: 'AT', BEL: 'BE',
  BIH: 'BA', BRA: 'BR', CAN: 'CA', CIV: 'CI', COD: 'CD',
  COL: 'CO', CPV: 'CV', CRO: 'HR', CUW: 'CW', CZE: 'CZ',
  ECU: 'EC', EGY: 'EG', ESP: 'ES', FRA: 'FR', GER: 'DE',
  GHA: 'GH', HAI: 'HT', IRN: 'IR', IRQ: 'IQ', JOR: 'JO',
  JPN: 'JP', KOR: 'KR', KSA: 'SA', MAR: 'MA', MEX: 'MX',
  NED: 'NL', NOR: 'NO', NZL: 'NZ', PAN: 'PA', PAR: 'PY',
  POR: 'PT', QAT: 'QA', RSA: 'ZA', SEN: 'SN', SUI: 'CH',
  SWE: 'SE', TUN: 'TN', TUR: 'TR', URY: 'UY', USA: 'US',
  UZB: 'UZ',
}

// England and Scotland have their own subdivision flags
const FLAG_OVERRIDES: Record<string, string> = {
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
}

function getFlag(code: string): string {
  if (FLAG_OVERRIDES[code]) return FLAG_OVERRIDES[code]
  const iso2 = FIFA_TO_ISO2[code]
  if (!iso2) return ''
  return [...iso2]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('')
}

function getSpanishName(team: Team): string {
  return esLocale.teams[team.code as keyof typeof esLocale.teams] ?? team.name
}

function escapeICS(str: string): string {
  return str.replace(/[\\,;]/g, '\\$&').replace(/\r?\n/g, '\\n')
}

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function buildVEvent(match: Match, teamsById: Map<string, Team>): string | null {
  const home = teamsById.get(match.homeTeamId)
  const away = teamsById.get(match.awayTeamId)
  if (!home || !away) return null

  const homeName = getSpanishName(home)
  const awayName = getSpanishName(away)
  const homeFlag = getFlag(home.code)
  const awayFlag = getFlag(away.code)

  const start = new Date(match.utcDate)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)

  const context = match.group
    ? `Grupo ${match.group.trim().slice(-1).toUpperCase()}`
    : match.stage.replace(/_/g, ' ')

  const summary = escapeICS(`${homeFlag} ${homeName} vs ${awayFlag} ${awayName}`)
  const description = escapeICS(`FIFA World Cup 2026 · ${context}`)

  return [
    'BEGIN:VEVENT',
    `UID:wc2026-match-${match.id}@wc2026-dashboard`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    match.venue ? `LOCATION:${escapeICS(match.venue)}` : '',
    'END:VEVENT',
  ]
    .filter(Boolean)
    .join('\r\n')
}

export function generateICS(
  matches: Match[],
  teamsById: Map<string, Team>,
): string {
  const events = matches
    .map((m) => buildVEvent(m, teamsById))
    .filter((e): e is string => e !== null)
    .join('\r\n')

  return [
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
}

export function downloadICS(content: string, filename = 'worldcup2026.ics') {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
