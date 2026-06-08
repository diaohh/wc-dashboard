import { collection, getDocs, orderBy, query } from 'firebase/firestore'

import { db } from '@/shared/api/firebase'
import type { Match } from '../model/types'

export async function fetchMatches(): Promise<Match[]> {
  // Single-field order → no composite index required at this scale (64 docs).
  const matchesQuery = query(
    collection(db, 'matches'),
    orderBy('utcDate', 'asc'),
  )
  const snapshot = await getDocs(matchesQuery)
  return snapshot.docs.map((doc) => doc.data() as Match)
}
