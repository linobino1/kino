import type { Event } from '@app/types/payload'
import type { TFunction } from 'i18next'
import { getMovieSpecsString, type Props as GetMovieSpecsProps } from './getMovieSpecsString'

type Props = {
  event: Event
  t: TFunction
  movieSpecsProps?: Partial<GetMovieSpecsProps>
}

export const getEventSubtitle = ({
  event,
  t,
  movieSpecsProps = { type: 'subtitle', separator: ' ' },
}: Props) => {
  if (typeof event.subtitle === 'string' && event.subtitle.length > 0) {
    return event.subtitle
  }

  if (event.mainProgramFilmPrint) {
    if (typeof event.mainProgramFilmPrint === 'string') {
      throw new Error('getEventSubtitle expects more depth')
    }

    return getMovieSpecsString({
      type: movieSpecsProps.type ?? 'subtitle',
      separator: movieSpecsProps.separator ?? ' ',
      filmPrint: event.mainProgramFilmPrint,
      t,
      hideDCP: true,
      hideGermanLanguageVersionForGermanMovies: true,
    })
  }
}
