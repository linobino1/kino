import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { ErrorComponent } from '~/components/Error'

export default function CatchAll() {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  return (
    <ErrorComponent
      error={new Error(t('error.404', { url: pathname, interpolation: { escapeValue: false } }))}
    />
  )
}
