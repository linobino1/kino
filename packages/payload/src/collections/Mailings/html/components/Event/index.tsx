import type { Event as EventType } from '@app/types/payload'
import type { Locale, TFunction } from '@app/i18n'
import React from 'react'
import Compact from './Compact'
import UnfoldProgramItems from './UnfoldProgramItems'

type EventProps = {
  event: EventType
  type: 'compact' | 'unfoldProgramItems'
  color: string
  additionalText?: any
  locale: Locale
  t: TFunction
}

const Event: React.FC<EventProps> = ({ type, ...props }) => {
  if (!props.event) {
    return null
  }

  switch (type) {
    case 'unfoldProgramItems':
      return <UnfoldProgramItems {...props} />
    default:
    case 'compact':
      return <Compact {...props} />
  }
}

export default Event
