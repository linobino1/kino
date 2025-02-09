import { Link, useLocation } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import type { Locale} from '@app/i18n';
import { locales } from '@app/i18n'
import { cn } from '~/util/cn'
import { getLocalizedPathnames } from '~/util/i18n/getHreflangLinks'

const icons: Record<Locale, { icon: string; label: string }> = {
  en: { icon: '🇬🇧', label: 'english' },
  de: { icon: '🇩🇪', label: 'deutsch' },
}

export type Props = {
  className?: string
}

export default function LanguageSwitch({ className }: Props) {
  const { i18n } = useTranslation()
  const { pathname } = useLocation()
  const pathnames = getLocalizedPathnames(pathname)

  return (
    <div className={cn('', className)}>
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
          <span className="md:sr-only">
            {icons[lang].label}
            &nbsp;
          </span>
          {icons[lang].icon}
        </Link>
      ))}
    </div>
  )
}
