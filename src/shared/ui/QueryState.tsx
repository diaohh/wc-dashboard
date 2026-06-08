import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from './skeleton'

interface QueryStateProps {
  isLoading: boolean
  isError: boolean
  isEmpty?: boolean
  emptyLabel?: string
  loadingFallback?: ReactNode
  children: ReactNode
}

/**
 * Renders loading / error / empty states for a React Query result, falling
 * through to `children` on success with data.
 */
export function QueryState({
  isLoading,
  isError,
  isEmpty = false,
  emptyLabel,
  loadingFallback,
  children,
}: QueryStateProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      loadingFallback ?? (
        <div className="space-y-3" aria-busy="true">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )
    )
  }

  if (isError) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm">
        {t('states.error')}
      </p>
    )
  }

  if (isEmpty) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm">
        {emptyLabel ?? t('states.empty')}
      </p>
    )
  }

  return <>{children}</>
}
