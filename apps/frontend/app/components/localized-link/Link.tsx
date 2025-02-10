import type { LinkProps } from '@remix-run/react'
import { Link as RemixLink } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { localizeTo } from '~/util/i18n/localizeTo'

export type Props = LinkProps & {
  localize?: boolean
}

export const Link: React.FC<Props> = ({ to, localize = true, ...props }) => {
  const { i18n } = useTranslation()
  if (localize) {
    to = localizeTo(to, i18n.language)
  }

  return <RemixLink {...props} to={to} />
}
