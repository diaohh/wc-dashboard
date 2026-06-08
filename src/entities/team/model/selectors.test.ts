import { describe, expect, it } from 'vitest'

import type { Team } from './types'
import { selectTeamsById } from './selectors'

const team = (id: string, name: string): Team => ({
  id,
  name,
  shortName: name,
  code: name.slice(0, 3).toUpperCase(),
  crest: '',
  groupId: null,
})

describe('selectTeamsById', () => {
  it('indexes teams by id', () => {
    const teams = [team('1', 'Argentina'), team('2', 'Brazil')]
    const map = selectTeamsById(teams)

    expect(map.size).toBe(2)
    expect(map.get('1')?.name).toBe('Argentina')
    expect(map.get('2')?.name).toBe('Brazil')
  })

  it('returns an empty map for no teams', () => {
    expect(selectTeamsById([]).size).toBe(0)
  })
})
