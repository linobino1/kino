import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

export default function CatchAll() {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  throw new Response(t('error.404', { url: pathname, interpolation: { escapeValue: false } }), {
    status: 404,
  })
}
