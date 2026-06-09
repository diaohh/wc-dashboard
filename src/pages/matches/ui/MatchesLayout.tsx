import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { cn } from '@/shared/lib/utils'

const tabs = [
  { to: '/matches', key: 'matches.tabs.upcoming', end: true },
  { to: '/matches/results', key: 'matches.tabs.results', end: false },
  { to: '/matches/groups', key: 'matches.tabs.groups', end: false },
  { to: '/matches/bracket', key: 'matches.tabs.bracket', end: false },
] as const

export function MatchesLayout() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
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

      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8"
      >
        <Outlet />
      </motion.div>
    </section>
  )
}
