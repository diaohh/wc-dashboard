import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui'

export function LanguageSwitch() {
  const { t, i18n } = useTranslation()
  const current = i18n.resolvedLanguage === 'en' ? 'en' : 'es'
  const next = current === 'es' ? 'en' : 'es'

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => void i18n.changeLanguage(next)}
      aria-label={t('common.language')}
    >
      <Languages />
      {current.toUpperCase()}
    </Button>
  )
}
