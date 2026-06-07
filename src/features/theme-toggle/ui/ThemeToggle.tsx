import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui'
import { useThemeStore } from '../model/theme-store'

export function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={t('common.theme')}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
