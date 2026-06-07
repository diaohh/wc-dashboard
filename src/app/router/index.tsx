import { createBrowserRouter } from 'react-router-dom'

import { HomePage } from '@/pages/home'
import { MatchesPage } from '@/pages/matches'
import { TeamsPage } from '@/pages/teams'
import { PredictionsPage } from '@/pages/predictions'
import { RootLayout } from './RootLayout'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/matches', element: <MatchesPage /> },
      { path: '/teams', element: <TeamsPage /> },
      { path: '/predictions', element: <PredictionsPage /> },
    ],
  },
])
