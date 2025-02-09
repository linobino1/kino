import React from 'react'
import { cn } from '~/util/cn'

const lineClassName = 'origin-center fill-none stroke-current transition-all duration-300'

export const Hamburger: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
      <line
        className={cn(lineClassName, {
          'opacity-0': collapsed,
        })}
        x1={1}
        y1={4}
        x2={29}
        y2={4}
      />
      <line
        className={cn(lineClassName, {
          'rotate-45': collapsed,
        })}
        x1={1}
        y1={15}
        x2={29}
        y2={15}
      />
      <line
        className={cn(lineClassName, {
          '-rotate-45': collapsed,
        })}
        x1={1}
        y1={15}
        x2={29}
        y2={15}
      />
      <line
        className={cn(lineClassName, { 'opacity-0': collapsed })}
        x1={1}
        y1={26}
        x2={29}
        y2={26}
      />
    </svg>
  )
}
