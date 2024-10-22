import React from 'react'
import { cn } from '~/util/cn'

export interface Type extends React.HTMLAttributes<HTMLHeadingElement> {
  text?: string
  children?: React.ReactNode
}

export const Heading: React.FC<Type> = ({ text, children, className, ...props }) => (
  <h1 {...props} className={cn('font-3xl text-center uppercase', className)}>
    {text || children}
  </h1>
)

export default Heading
