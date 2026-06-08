import { Link, useRouteError } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui'

export function RouteError() {
  const { t } = useTranslation()
  const error = useRouteError()
  const message = error instanceof Error ? error.message : String(error ?? '')

  return (
    <section className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold tracking-tight">{t('error.title')}</h1>
      <p className="text-muted-foreground mt-2">{t('error.description')}</p>
      {message && (
        <pre className="bg-muted text-muted-foreground mt-4 max-w-full overflow-auto rounded-md p-3 text-left text-xs">
          {message}
        </pre>
      )}
      <Button asChild className="mt-6">
        <Link to="/">{t('notFound.back')}</Link>
      </Button>
    </section>
  )
}
