import React from 'react'
import type { TFunction } from '@app/i18n'
import type { Event, Location } from '@app/types/payload'
import type { ViewProps } from '@react-pdf/renderer'
import { Text, View } from '@react-pdf/renderer'
import { formatDate } from '@app/util/formatDate'
import { pageMargin } from '../util/styles'

type Props = ViewProps & {
  event: Event
  t: TFunction
}

export const EventLocationAndDate: React.FC<Props> = ({ event, t, ...props }) => {
  const height = 80
  const bottom = pageMargin.bottom + 20
  return (
    <React.Fragment>
      {/* placeholder for the absolutely positioned content */}
      <View style={{ height: height + bottom }} />
      <View
        style={{
          height,
          fontSize: 14,
          fontWeight: 'bold',
          position: 'absolute',
          bottom,
          right: pageMargin.right,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          textAlign: 'right',
          ...props.style,
        }}
        {...props}
      >
        <Text>{formatDate(event.date, 'PPPP, p')}</Text>
        <Text>{(event.location as Location).address}</Text>
        <Text>{t('pdf.coverCharge')}</Text>
      </View>
    </React.Fragment>
  )
}
