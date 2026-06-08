import type {
  FDMatchesResponse,
  FDStandingsResponse,
  FDTeamsResponse,
} from './types.js'

const BASE_URL = 'https://api.football-data.org/v4'
const COMPETITION_ID = 2000 // FIFA World Cup

function headers(): Record<string, string> {
  const token = process.env.FOOTBALL_DATA_TOKEN
  if (!token) throw new Error('FOOTBALL_DATA_TOKEN is not set')
  return { 'X-Auth-Token': token }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: headers() })
  if (!res.ok) {
    throw new Error(`football-data.org ${path} → ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchTeams(): Promise<FDTeamsResponse> {
  return get<FDTeamsResponse>(`/competitions/${COMPETITION_ID}/teams`)
}

export async function fetchStandings(): Promise<FDStandingsResponse> {
  await delay(500)
  return get<FDStandingsResponse>(`/competitions/${COMPETITION_ID}/standings`)
}

export async function fetchMatches(): Promise<FDMatchesResponse> {
  await delay(500)
  return get<FDMatchesResponse>(`/competitions/${COMPETITION_ID}/matches`)
}
