import * as React from 'react'

import { useThemeStore } from '@/features/theme-toggle'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme)

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <>{children}</>
}
