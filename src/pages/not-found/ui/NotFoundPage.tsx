import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
      <p className="text-muted-foreground text-7xl font-extrabold tracking-tighter">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        {t('notFound.title')}
      </h1>
      <p className="text-muted-foreground mt-2">{t('notFound.description')}</p>
      <Button asChild className="mt-6">
        <Link to="/">{t('notFound.back')}</Link>
      </Button>
    </section>
  )
}
