import React from 'react'
import { cn } from '@app/util/cn'
import type { Page } from '@app/types/payload'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  type?: Page['layoutType']
}

export const PageLayout: React.FC<Props> = ({ type = 'default', className, ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        'flex-1 pb-12',
        {
          'bg-theme-500 text-white': type === 'default',
          'bg-theme-500 text-yellow-500': type === 'info',
        },
        className,
      )}
    />
  )
}
