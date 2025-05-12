import React from 'react'
import { serializeLexical } from './serialize'
import { cn } from '@app/util/cn'
import { useTranslation } from 'react-i18next'
import type { Locale } from '@app/i18n'

type Props = {
  className?: string
  content: any
  enableGutter?: boolean
  enableProse?: boolean
  enableMarginBlock?: boolean
}

export const RichText: React.FC<Props> = ({
  className,
  content,
  enableProse = true,
  enableMarginBlock = true,
}) => {
  if (!content) {
    return null
  }

  const { i18n } = useTranslation()
  const locale = i18n.language as Locale

  return (
    <div className={className}>
      <div
        className={cn('!max-w-none', {
          prose: enableProse,
        })}
      >
        {content &&
          !Array.isArray(content) &&
          typeof content === 'object' &&
          'root' in content &&
          serializeLexical({ nodes: content?.root?.children, enableMarginBlock, locale })}
      </div>
    </div>
  )
}
