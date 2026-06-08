import { useQuery } from '@tanstack/react-query'

import { fetchGroups } from './queries'

export function useGroups() {
  return useQuery({ queryKey: ['groups'], queryFn: fetchGroups })
}
