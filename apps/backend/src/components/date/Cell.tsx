'use client'

import { timezone } from '@app/util/config'
import { formatInTimeZone } from 'date-fns-tz'
import { parseISO } from 'date-fns'
import { DefaultCell } from '@payloadcms/ui'

/**
 * use the timezone from the config to format the date
 */
export const Cell: React.FC<any> = ({ cellData, ...props }) => {
  const s = formatInTimeZone(parseISO(cellData || ''), timezone, 'PP HH:mm')
  return <DefaultCell cellData={s} {...props} />
}
