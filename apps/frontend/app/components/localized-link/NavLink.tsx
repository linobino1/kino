import type { NavLinkProps } from 'react-router'
import { NavLink as RemixNavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { localizeTo } from '~/util/i18n/localizeTo'

export type Props = NavLinkProps

export const NavLink: React.FC<Props> = ({ to, ...props }) => {
  const { i18n } = useTranslation()
  to = localizeTo(to, i18n.language)

  return <RemixNavLink {...props} to={to} />
}
