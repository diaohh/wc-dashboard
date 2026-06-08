import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LanguageSwitch } from '@/features/language-switch'
import { ThemeToggle } from '@/features/theme-toggle'

const navButtons = [
  { to: '/matches', key: 'nav.matches' },
  { to: '/predictions', key: 'nav.predictions' },
  { to: '/teams', key: 'nav.teams' },
] as const

export function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden">
      {/*
        Background placeholder. TODO: swap for a looping football video/gif, or
        an image with a dark overlay (see example-mainpage.html). Gradient for now.
      */}
      <div className="bg-wc-dark absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_25%,rgba(16,98,52,0.45),transparent_55%)]" />
      <div className="from-wc-dark/80 to-wc-green/80 absolute inset-0 -z-10 bg-gradient-to-b backdrop-blur-sm" />

      {/* Subtle top-right controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 text-white">
        <LanguageSwitch />
        <ThemeToggle />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center px-4 text-center text-white"
      >
        <div className="mb-12">
          <h1 className="from-wc-gold mb-2 bg-gradient-to-br to-yellow-200 bg-clip-text text-7xl font-extrabold tracking-tighter text-transparent drop-shadow-lg md:text-9xl">
            WC2026
          </h1>
          <div className="text-wc-gold/80 flex items-center justify-center gap-2 text-sm font-semibold tracking-[0.3em] uppercase md:text-base">
            <span className="bg-wc-gold/50 h-px w-8" />
            <p>Canada · Mexico · USA</p>
            <span className="bg-wc-gold/50 h-px w-8" />
          </div>
        </div>

        <nav className="flex w-full max-w-2xl flex-col gap-4 md:flex-row md:gap-6">
          {navButtons.map((button, i) => (
            <motion.div
              key={button.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="w-full"
            >
              <Link
                to={button.to}
                className="group hover:border-wc-gold hover:bg-wc-gold flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                <span className="group-hover:text-wc-dark text-lg font-semibold tracking-wide transition-colors duration-300">
                  {t(button.key)}
                </span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.main>
    </div>
  )
}
