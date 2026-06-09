export type { Team } from './model/types'
export {
  CONFEDERATION_BY_CODE,
  getConfederation,
  selectTeamsById,
} from './model/selectors'
export { fetchTeams } from './api/queries'
export { useTeams } from './api/hooks'
export { TeamLabel } from './ui/TeamLabel'
