import React from 'react'
import type { Event as EventType, PressRelease, PressReleasesConfig } from '@app/types/payload'
import type { TFunction } from '@app/i18n'
import { Document, Font } from '@react-pdf/renderer'
import { Event } from './components/Event'
import { CoverSheet } from './components/CoverSheet'
import { env } from '@app/util/env/frontend.server'

type Props = {
  pressReleasesConfig: PressReleasesConfig
  pressRelease: PressRelease
  events: EventType[]
  t: TFunction
}

Font.register({
  family: 'Noto',
  fonts: [
    // the fonts must be present in the public folder of the backend app!
    {
      src: `${env.FRONTEND_URL}/fonts/NotoSansDisplay-Regular.ttf`,
      fontWeight: 'normal',
      fontStyle: 'normal',
    },
    {
      src: `${env.FRONTEND_URL}/fonts/NotoSansDisplay-SemiBold.ttf`,
      fontWeight: 'semibold',
      fontStyle: 'normal',
    },
    {
      src: `${env.FRONTEND_URL}/fonts/NotoSansDisplay-Italic.ttf`,
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
    {
      src: `${env.FRONTEND_URL}/fonts/NotoSansDisplay-SemiBoldItalic.ttf`,
      fontWeight: 'semibold',
      fontStyle: 'italic',
    },
  ],
})
Font.hyphenationCallback = (word) => [word]

export const PressPDF: React.FC<Props> = ({ pressReleasesConfig, pressRelease, events, t }) => {
  return (
    <Document
      pageMode="fullScreen"
      pageLayout="singlePage"
      author="Kino im Blauen Salon"
      modificationDate={new Date()}
      style={{
        fontFamily: 'Noto',
        fontSize: 12,
      }}
    >
      {pressRelease.createCoverSheet && (
        <CoverSheet pressReleasesConfig={pressReleasesConfig} pressRelease={pressRelease} t={t} />
      )}

      {events.map((event) => (
        <Event key={event.id} event={event} t={t} />
      ))}
    </Document>
  )
}
