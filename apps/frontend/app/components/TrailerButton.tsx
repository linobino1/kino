import type { Movie } from '@app/types/payload'
import { Button, type Props as ButtonProps } from './Button'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@app/util/cn'
import { ButtonIcon } from './ButtonIcon'

type Props = Omit<ButtonProps<typeof Link>, 'as' | 'children' | 'to'> & {
  movie: Movie
}

export const TrailerButton: React.FC<Props> = ({ movie, className, ...props }) => {
  const { t } = useTranslation()
  return movie.trailer ? (
    <Button
      as={Link}
      look="black"
      to={movie.trailer}
      target="_blank"
      className={cn('group flex items-center uppercase', className)}
      {...props}
    >
      {t('Trailer')}
      <ButtonIcon icon="play" className="translate-x-[2px] group-hover:scale-[1.1]" />
    </Button>
  ) : null
}
