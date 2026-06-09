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
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between gap-4 px-4">
        <NavLink
          to="/"
          aria-label="WC2026"
          className="from-wc-gold bg-gradient-to-r to-yellow-600 bg-clip-text text-2xl font-black tracking-tighter text-transparent transition-transform duration-300 select-none hover:scale-105"
        >
          ⚽ WC2026
        </NavLink>

        <nav className="hidden items-center gap-2 sm:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'group hover:text-foreground relative px-3 py-2 text-base font-semibold transition-colors',
                  isActive ? 'text-wc-gold' : 'text-muted-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {t(item.key)}
                  <span
                    className={cn(
                      'bg-wc-gold absolute inset-x-3 -bottom-0.5 h-0.5 origin-center rounded-full transition-transform duration-300',
                      isActive
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100',
                    )}
                  />
                </>
              )}
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
