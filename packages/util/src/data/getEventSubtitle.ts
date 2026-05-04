import type { Event } from '@app/types/payload'
import type { TFunction } from 'i18next'
import {
  getMovieSpecsString,
  type Props as GetMovieSpecsStringProps,
  type Type as GetMovieSpecsStringType,
} from './getMovieSpecsString'

type Props = Omit<GetMovieSpecsStringProps, 'type' | 'items' | 'filmPrint'> & {
  type?: GetMovieSpecsStringType
  event: Event
  t: TFunction
}

export const getEventSubtitle = ({ event, t, type, ...props }: Props) => {
  if (typeof event.subtitle === 'string' && event.subtitle.length > 0) {
    return event.subtitle
  }

  if (event.mainProgramFilmPrint) {
    if (typeof event.mainProgramFilmPrint === 'string') {
      throw new Error('getEventSubtitle expects more depth')
    }

    return getMovieSpecsString({
      ...props,
      type: type ?? 'subtitle',
      filmPrint: event.mainProgramFilmPrint,
      t,
    })
  }
}
