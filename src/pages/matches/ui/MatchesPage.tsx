import { useTranslation } from 'react-i18next'

export function MatchesPage() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{t('nav.matches')}</h1>
      <p className="text-muted-foreground mt-2">{t('common.comingSoon')}</p>
    </section>
  )
}
