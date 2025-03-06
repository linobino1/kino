import React from 'react'
import type { TFunction } from '@app/i18n'
import type { PageProps } from '@react-pdf/renderer'
import { Page as _Page, Text, View } from '@react-pdf/renderer'
import { pageMargin } from '../util/styles'

type Props = PageProps & {
  children: React.ReactNode
  t: TFunction
}

export const Page: React.FC<Props> = ({ t, children, ...props }) => {
  return (
    <_Page
      size="A4"
      orientation="portrait"
      wrap
      dpi={72}
      style={{ padding: pageMargin, ...props.style }}
      {...props}
    >
      {children}
      <View
        style={{
          position: 'absolute',
          bottom: pageMargin,
          left: pageMargin,
          right: pageMargin,
          display: 'flex',
          alignItems: 'flex-start',
          fontSize: 10,
        }}
      >
        <Text
          render={({ pageNumber, totalPages }) => t('pdf.pageNumbers', { pageNumber, totalPages })}
          fixed
        />
      </View>
    </_Page>
  )
}
