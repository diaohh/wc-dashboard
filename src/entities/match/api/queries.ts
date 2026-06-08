import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'

import { db } from '@/shared/api/firebase'
import type { Match } from '../model/types'

/** Fetch every match once, ordered by date. Used by results and the bracket. */
export async function fetchMatches(): Promise<Match[]> {
  // Single-field order → no composite index required.
  const matchesQuery = query(collection(db, 'matches'), orderBy('utcDate', 'asc'))
  const snapshot = await getDocs(matchesQuery)
  return snapshot.docs.map((doc) => doc.data() as Match)
}

export const UPCOMING_PAGE_SIZE = 12

export type Cursor = QueryDocumentSnapshot<DocumentData> | null

export interface UpcomingMatchesPage {
  matches: Match[]
  cursor: Cursor
}

/**
 * Page through upcoming matches (kickoff in the future), ascending by date.
 * Range filter + order on the same `utcDate` field → no composite index.
 */
export async function fetchUpcomingMatchesPage(
  cursor: Cursor,
): Promise<UpcomingMatchesPage> {
  const nowIso = new Date().toISOString()
  const matchesQuery = query(
    collection(db, 'matches'),
    where('utcDate', '>=', nowIso),
    orderBy('utcDate', 'asc'),
    ...(cursor ? [startAfter(cursor)] : []),
    limit(UPCOMING_PAGE_SIZE),
  )
  const snapshot = await getDocs(matchesQuery)
  const matches = snapshot.docs.map((doc) => doc.data() as Match)
  // No further pages once a short page comes back.
  const cursorNext =
    snapshot.docs.length < UPCOMING_PAGE_SIZE
      ? null
      : (snapshot.docs.at(-1) ?? null)

  return { matches, cursor: cursorNext }
}
