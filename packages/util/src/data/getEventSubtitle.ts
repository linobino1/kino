import type { Event } from '@app/types/payload'
import type { TFunction } from 'i18next'
import { getMovieSpecsString } from './getMovieSpecsString'

type Props = {
  event: Event
  t: TFunction
}

export const getEventSubtitle = ({ event, t }: Props) => {
  if (typeof event.subtitle === 'string' && event.subtitle.length > 0) {
    return event.subtitle
  }

  if (event.mainProgramFilmPrint) {
    if (typeof event.mainProgramFilmPrint === 'string') {
      throw new Error('getEventSubtitle expects more depth')
    }

    return getMovieSpecsString({
      type: 'subtitle',
      filmPrint: event.mainProgramFilmPrint,
      t,
      separator: ' ',
    })
  }
}
