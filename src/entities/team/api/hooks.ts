import { useQuery } from '@tanstack/react-query'

import { fetchTeams } from './queries'

export function useTeams() {
  return useQuery({ queryKey: ['teams'], queryFn: fetchTeams })
}
