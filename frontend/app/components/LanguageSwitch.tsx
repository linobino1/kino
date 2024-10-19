import { Link, useLocation } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { locales } from 'shared/config'
import { cn } from '~/util/cn'
import { getLocalizedPathnames } from '~/util/i18n/getHreflangLinks'

export const languages = {
  en: { nativeName: 'English' },
  de: { nativeName: 'Deutsch' },
}

export type Props = {
  className?: string
}

export default function LanguageSwitch({ className }: Props) {
  const { i18n } = useTranslation()
  const { pathname } = useLocation()
  const pathnames = getLocalizedPathnames(pathname)

  return (
    <div className={className}>
      {locales.map((lang) => (
        <Link
          key={lang}
          className={cn({
            hidden: i18n.language === lang,
          })}
          to={pathnames[lang] as string}
          rel="alternate"
          hrefLang={lang}
          onClick={() => i18n.changeLanguage(lang)}
          preventScrollReset
          reloadDocument
        >
          {lang.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}
