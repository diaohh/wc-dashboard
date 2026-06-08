import { collection, getDocs } from 'firebase/firestore'

import { db } from '@/shared/api/firebase'
import type { Team } from '../model/types'

export async function fetchTeams(): Promise<Team[]> {
  const snapshot = await getDocs(collection(db, 'teams'))
  return snapshot.docs.map((doc) => doc.data() as Team)
}
