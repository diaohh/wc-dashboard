import { createBrowserRouter } from 'react-router-dom'

import { HomePage } from '@/pages/home'
import {
  BracketPage,
  GroupsPage,
  MatchesLayout,
  ResultsPage,
  UpcomingMatchesPage,
} from '@/pages/matches'
import { TeamsPage } from '@/pages/teams'
import { PredictionsPage } from '@/pages/predictions'
import { NotFoundPage } from '@/pages/not-found'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'

export const router = createBrowserRouter([
  // Immersive full-screen landing (no global header).
  { path: '/', element: <HomePage />, errorElement: <RouteError /> },
  // Inner sections share the site header.
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      {
        path: '/matches',
        element: <MatchesLayout />,
        children: [
          { index: true, element: <UpcomingMatchesPage /> },
          { path: 'results', element: <ResultsPage /> },
          { path: 'groups', element: <GroupsPage /> },
          { path: 'bracket', element: <BracketPage /> },
        ],
      },
      { path: '/teams', element: <TeamsPage /> },
      { path: '/predictions', element: <PredictionsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
