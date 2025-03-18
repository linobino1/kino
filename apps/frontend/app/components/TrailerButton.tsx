import type { Movie } from '@app/types/payload'
import { Button, type Props as ButtonProps } from './Button'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

type Props = ButtonProps & {
  movie: Movie
}

export const TrailerButton: React.FC<Props> = ({ movie, ...props }) => {
  const { t } = useTranslation()
  return movie.trailer ? (
    <Link className="contents" to={movie.trailer} target="_blank">
      <Button look="black" className="flex items-center uppercase" {...props}>
        {t('Trailer')}
        <span className="i-material-symbols:play-arrow relative left-1 text-lg" />
      </Button>
    </Link>
  ) : null
}
