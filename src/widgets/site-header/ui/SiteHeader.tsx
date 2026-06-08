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
    <header className="bg-background/70 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <NavLink
          to="/"
          className="from-wc-gold bg-gradient-to-r to-yellow-600 bg-clip-text text-xl font-black tracking-tighter text-transparent"
        >
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
                  'hover:text-foreground rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
                  isActive ? 'text-wc-gold' : 'text-muted-foreground',
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
