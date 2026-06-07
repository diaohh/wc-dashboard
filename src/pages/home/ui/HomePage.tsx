import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui'

const sections = [
  { to: '/matches', key: 'matches' },
  { to: '/teams', key: 'teams' },
  { to: '/predictions', key: 'predictions' },
] as const

export function HomePage() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="from-foreground to-foreground/60 bg-gradient-to-b bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl"
      >
        {t('home.heading')}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-muted-foreground mt-4 max-w-xl text-balance"
      >
        {t('home.subheading')}
      </motion.p>

      <div className="mt-14 grid w-full gap-4 sm:grid-cols-3">
        {sections.map((section, i) => (
          <motion.div
            key={section.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
          >
            <Link to={section.to} className="group block h-full">
              <Card className="h-full text-left transition-all group-hover:-translate-y-1 group-hover:shadow-md">
                <CardHeader>
                  <CardTitle>{t(`home.cards.${section.key}.title`)}</CardTitle>
                  <CardDescription>
                    {t(`home.cards.${section.key}.description`)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
