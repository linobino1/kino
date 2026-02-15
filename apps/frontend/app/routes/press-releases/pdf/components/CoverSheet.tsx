import React from 'react'
import type { TFunction } from '@app/i18n'
import type { Media, PressRelease, PressReleasesConfig } from '@app/types/payload'
import { Image, Text, View } from '@react-pdf/renderer'
import { Page } from './Page'
import { formatDate } from '@app/util/formatDate'
import { siteTitle } from '@app/util/config'
import { RichText } from './RichText'
import { env } from '@app/util/env/frontend.server'
import { getMediaUrl } from '@app/util/media/getMediaUrl'

type Props = {
  pressReleasesConfig: PressReleasesConfig
  pressRelease: PressRelease
  t: TFunction
}

export const CoverSheet: React.FC<Props> = ({
  pressReleasesConfig: { address, logo },
  pressRelease: { createCoverSheet, title, coverText, date, locale },
  t,
}) => {
  const media = logo as Media
  const optimizedMediaUrl = getMediaUrl(media, env)
  return (
    <Page startPageNumber={createCoverSheet ? 1 : 2} t={t}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          fontSize: 16,
          marginTop: 16,
        }}
      >
        <Text style={{ fontSize: 12 }}>
          {t('pdf.title', { date: formatDate(date, 'PP', locale) })}
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 10,
            width: 200,
          }}
        >
          <Image src={optimizedMediaUrl} style={{ width: 150, marginTop: 4, marginBottom: 16 }} />
          <RichText data={address} />
        </View>
      </View>
      <View style={{ marginTop: 32 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 16 }}>{`${siteTitle} - ${title}`}</Text>
        {coverText && <RichText data={coverText} />}
      </View>
    </Page>
  )
}
