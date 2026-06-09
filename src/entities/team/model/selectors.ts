import type { Team } from './types'

/** Index teams by id for joining into matches and standings. */
export function selectTeamsById(teams: Team[]): Map<string, Team> {
  return new Map(teams.map((team) => [team.id, team]))
}

export const CONFEDERATION_BY_CODE: Record<string, string> = {
  ALG: 'CAF',
  ARG: 'CONMEBOL',
  AUS: 'AFC',
  AUT: 'UEFA',
  BEL: 'UEFA',
  BIH: 'UEFA',
  BRA: 'CONMEBOL',
  CAN: 'CONCACAF',
  CIV: 'CAF',
  COD: 'CAF',
  COL: 'CONMEBOL',
  CPV: 'CAF',
  CRO: 'UEFA',
  CUW: 'CONCACAF',
  CZE: 'UEFA',
  ECU: 'CONMEBOL',
  EGY: 'CAF',
  ENG: 'UEFA',
  ESP: 'UEFA',
  FRA: 'UEFA',
  GER: 'UEFA',
  GHA: 'CAF',
  HAI: 'CONCACAF',
  IRN: 'AFC',
  IRQ: 'AFC',
  JOR: 'AFC',
  JPN: 'AFC',
  KOR: 'AFC',
  KSA: 'AFC',
  MAR: 'CAF',
  MEX: 'CONCACAF',
  NED: 'UEFA',
  NOR: 'UEFA',
  NZL: 'OFC',
  PAN: 'CONCACAF',
  PAR: 'CONMEBOL',
  POR: 'UEFA',
  QAT: 'AFC',
  RSA: 'CAF',
  SCO: 'UEFA',
  SEN: 'CAF',
  SUI: 'UEFA',
  SWE: 'UEFA',
  TUN: 'CAF',
  TUR: 'UEFA',
  URY: 'CONMEBOL',
  USA: 'CONCACAF',
  UZB: 'AFC',
}

export function getConfederation(code: string): string | undefined {
  return CONFEDERATION_BY_CODE[code]
}
