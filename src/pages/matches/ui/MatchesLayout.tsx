import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router-dom'

import { cn } from '@/shared/lib/utils'

const tabs = [
  { to: '/matches', key: 'matches.tabs.upcoming', end: true },
  { to: '/matches/results', key: 'matches.tabs.results', end: false },
  { to: '/matches/groups', key: 'matches.tabs.groups', end: false },
  { to: '/matches/bracket', key: 'matches.tabs.bracket', end: false },
] as const

export function MatchesLayout() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">{t('nav.matches')}</h1>

      <nav className="mt-6 flex gap-1 overflow-x-auto border-b">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                '-mb-px shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground border-transparent',
              )
            }
          >
            {t(tab.key)}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6">
        <Outlet />
      </div>
    </section>
  )
}
