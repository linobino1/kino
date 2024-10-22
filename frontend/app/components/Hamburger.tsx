import React from 'react'
import { classes } from '~/classes'

export const Hamburger: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      className={`${classes.svg} ${collapsed ? classes.collapsed : ''}`}
    >
      <line className={classes.line1} x1={1} y1={4} x2={29} y2={4} />
      <line className={classes.line2} x1={1} y1={15} x2={29} y2={15} />
      <line className={classes.line3} x1={1} y1={15} x2={29} y2={15} />
      <line className={classes.line4} x1={1} y1={26} x2={29} y2={26} />
    </svg>
  )
}
