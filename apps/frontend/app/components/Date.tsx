import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@app/util/formatDate'
import type { Locale } from '@app/i18n'

type Props = {
  date: string | Date
  format?: string
  className?: string
}

export const Date: React.FC<Props> = ({ date, className, format = 'LLLL d, yyyy' }) => {
  const { i18n } = useTranslation()
  const str = formatDate(date, format, i18n.language as Locale)

  const iso = typeof date === 'string' ? date : date.toISOString()

  return (
    <time suppressHydrationWarning className={className} dateTime={iso}>
      {str}
    </time>
  )
}
