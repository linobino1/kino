import React from 'react'
import { serializeLexical } from './serialize'
import { cn } from '@app/util/cn'

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
          serializeLexical({ nodes: content?.root?.children, enableMarginBlock })}
      </div>
    </div>
  )
}
