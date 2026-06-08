import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { fetchMatches, fetchUpcomingMatchesPage, type Cursor } from './queries'

export function useMatches() {
  return useQuery({ queryKey: ['matches'], queryFn: fetchMatches })
}

export function useInfiniteUpcomingMatches() {
  return useInfiniteQuery({
    queryKey: ['matches', 'upcoming'],
    queryFn: ({ pageParam }) => fetchUpcomingMatchesPage(pageParam),
    initialPageParam: null as Cursor,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })
}
