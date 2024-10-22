import { Blocks } from './Blocks'
import React from 'react'
import { type PageLayout } from '@/fields/pageLayout'
import { classes } from '~/classes'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  layout?: PageLayout
  layoutType?: PageLayout['type']
  children?: React.ReactNode
}

export const Page: React.FC<Props> = ({ layout, layoutType, children, ...props }) => {
  return (
    <div
      {...props}
      data-layout-type={layout?.type || layoutType || 'default'}
      className={`${classes.page} ${props.className}`}
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
