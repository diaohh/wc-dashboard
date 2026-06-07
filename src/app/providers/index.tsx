import * as React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import '@/shared/config/i18n'
import { queryClient } from './query-client'
import { ThemeProvider } from './ThemeProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  )
}
