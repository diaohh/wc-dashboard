import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

import { fetchMatches, fetchStandings, fetchTeams } from './api.js'
import type { Group, Match, Team } from './domain.js'
import { buildGroupMap, mapGroups, mapMatches, mapTeams } from './mappers.js'

function initAdmin() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT is not set')
  const serviceAccount = JSON.parse(raw) as Parameters<typeof cert>[0]
  initializeApp({ credential: cert(serviceAccount) })
  return getFirestore()
}

async function writeInBatches<T extends { id: string }>(
  db: Firestore,
  collectionName: string,
  docs: T[],
) {
  // Firestore batch limit is 500 ops; split if needed
  const BATCH_SIZE = 499
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = db.batch()
    const chunk = docs.slice(i, i + BATCH_SIZE)
    for (const doc of chunk) {
      batch.set(db.collection(collectionName).doc(doc.id), doc, { merge: true })
    }
    await batch.commit()
  }
}

async function run() {
  const db = initAdmin()

  console.log('Fetching teams…')
  const teamsRes = await fetchTeams()

  console.log('Fetching standings…')
  const standingsRes = await fetchStandings()

  console.log('Fetching matches…')
  const matchesRes = await fetchMatches()

  const groupMap = buildGroupMap(standingsRes.standings)
  const groups: Group[] = mapGroups(standingsRes.standings)
  const teams: Team[] = mapTeams(teamsRes.teams, groupMap)
  const matches: Match[] = mapMatches(matchesRes.matches)

  console.log(`Writing ${teams.length} teams, ${groups.length} groups, ${matches.length} matches…`)

  await Promise.all([
    writeInBatches(db, 'teams', teams),
    writeInBatches(db, 'groups', groups),
    writeInBatches(db, 'matches', matches),
  ])

  console.log('Sync complete.')
}

run().catch((err: unknown) => {
  console.error('Sync failed:', err)
  process.exit(1)
})
