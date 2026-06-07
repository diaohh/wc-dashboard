import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/utils'
import { LanguageSwitch } from '@/features/language-switch'
import { ThemeToggle } from '@/features/theme-toggle'

const navItems = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/matches', key: 'nav.matches', end: false },
  { to: '/teams', key: 'nav.teams', end: false },
  { to: '/predictions', key: 'nav.predictions', end: false },
] as const

export function SiteHeader() {
  const { t } = useTranslation()

  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <NavLink to="/" className="font-semibold tracking-tight">
          ⚽ {t('app.title')}
        </NavLink>

        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive && 'bg-accent text-accent-foreground',
                )
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
