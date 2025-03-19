import type { Movie } from '@app/types/payload'
import { Button, type Props as ButtonProps } from './Button'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@app/util/cn'

type Props = ButtonProps & {
  movie: Movie
}

export const TrailerButton: React.FC<Props> = ({ movie, className, ...props }) => {
  const { t } = useTranslation()
  return movie.trailer ? (
    <Link className="group contents" to={movie.trailer} target="_blank">
      <Button look="black" className={cn('flex items-center uppercase', className)} {...props}>
        {t('Trailer')}
        <div className="i-material-symbols:play-arrow translate-x-[2px] text-lg transition-transform group-hover:scale-[1.1]" />
      </Button>
    </Link>
  ) : null
}
