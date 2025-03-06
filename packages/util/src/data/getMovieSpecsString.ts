import {
  getMovieSpecs,
  type Props as GetMovieSpecsProps,
  type MovieSpecsItem,
} from './getMovieSpecs'

type Type = 'custom' | 'filmPrintInfosShort' | 'subtitle' | 'full'
type Props = GetMovieSpecsProps &
  (
    | {
        type: Type
        items?: never
      }
    | {
        type?: never
        items: MovieSpecsItem[]
      }
  )

/**
 * pass either a predefined type or an array of items to get a string of movie specs
 */
export const getMovieSpecsString = ({ filmPrint, t, type = 'custom', items = [] }: Props) => {
  const specs = getMovieSpecs({ filmPrint, t })

  if (type === 'custom') {
    return items
      .map((item) => specs[item])
      .filter(Boolean)
      .join(' | ')
  }

  switch (type) {
    case 'filmPrintInfosShort':
      return [specs.format, specs.language].filter(Boolean).join(' | ')

    case 'subtitle':
      return [specs.format, specs.languageShort].filter(Boolean).join(' ')

    default:
    case 'full':
      return [
        specs.directors,
        specs.countries,
        specs.year,
        specs.duration,
        specs.format,
        specs.language,
        specs.cast,
      ]
        .filter(Boolean)
        .join(' | ')
  }
}
