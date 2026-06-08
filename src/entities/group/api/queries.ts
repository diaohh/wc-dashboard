import { collection, getDocs } from 'firebase/firestore'

import { db } from '@/shared/api/firebase'
import type { Group } from '../model/types'

export async function fetchGroups(): Promise<Group[]> {
  const snapshot = await getDocs(collection(db, 'groups'))
  return snapshot.docs
    .map((doc) => doc.data() as Group)
    .sort((a, b) => a.id.localeCompare(b.id))
}
