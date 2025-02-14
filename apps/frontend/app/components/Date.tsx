import React from 'react'
import { parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { enUS, de } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { useEnv } from '~/util/useEnv'

type Props = {
  iso: string
  format?: string
  className?: string
}

export const Date: React.FC<Props> = ({ iso, className, format }) => {
  const env = useEnv()
  const date = parseISO(iso)
  const tz = env?.TIMEZONE ?? 'UTC'
  const { i18n } = useTranslation()
  const locale = i18n.language === 'de' ? de : enUS
  if (!date || isNaN(date.getMilliseconds())) {
    console.warn('encountered invalid date', iso)
    return <></>
  }
  const str = formatInTimeZone(date, tz, format ?? 'LLLL d, yyyy', {
    locale,
  })

  return (
    <time suppressHydrationWarning className={className} dateTime={iso}>
      {str}
    </time>
  )
}

export default Date
