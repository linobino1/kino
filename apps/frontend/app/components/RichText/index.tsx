import type React from 'react'
import { serializeLexical } from './serialize'
import { useTranslation } from 'react-i18next'
import type { Locale } from '@app/i18n'

type Props = {
  className?: string
  content: any
  enableGutter?: boolean
  enableMarginBlock?: boolean
}

export const RichText: React.FC<Props> = ({ className, content, enableMarginBlock = true }) => {
  if (!content) {
    return null
  }

  const { i18n } = useTranslation()
  const locale = i18n.language as Locale

  return (
    <div className={className}>
      <div className="!max-w-none">
        {content &&
          !Array.isArray(content) &&
          typeof content === 'object' &&
          'root' in content &&
          serializeLexical({ nodes: content?.root?.children, enableMarginBlock, locale })}
      </div>
    </div>
  )
}
