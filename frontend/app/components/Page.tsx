import { Blocks } from './Blocks'
import React from 'react'
import { type PageLayout } from '@/fields/pageLayout'
import { classes } from '~/classes'
import { cn } from '~/util/cn'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  layout?: PageLayout
  layoutType?: PageLayout['type']
  children?: React.ReactNode
}

export const Page: React.FC<Props> = ({ layout, layoutType, children, ...props }) => {
  const type = layout?.type || layoutType || 'default'
  return (
    <div
      {...props}
      className={cn({
        'bg-theme-500 text-white': type === 'default',
        'bg-white text-black': type === 'info',
      })}
    >
      {layout?.blocks ? (
        <Blocks blocks={layout.blocks} className={classes.blocks}>
          {children}
        </Blocks>
      ) : (
        children
      )}
    </div>
  )
}

export default Page
