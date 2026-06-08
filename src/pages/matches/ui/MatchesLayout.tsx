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
    <section className="relative mx-auto max-w-6xl px-4 py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="bg-wc-gold/10 absolute -top-10 -right-20 size-96 rounded-full blur-3xl" />
        <div className="bg-wc-gold/5 absolute bottom-1/4 -left-32 size-[40rem] rounded-full blur-3xl" />
      </div>

      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
        {t('nav.matches')}
      </h1>

      <nav className="bg-card mt-6 flex w-max max-w-full gap-1 overflow-x-auto rounded-full border p-1.5 shadow-sm">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                'shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-all',
                isActive
                  ? 'bg-wc-gold text-white shadow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )
            }
          >
            {t(tab.key)}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8">
        <Outlet />
      </div>
    </section>
  )
}
