import type { Media, Movie } from '@/payload-types'
import { Image, type Props as ImageProps } from '~/components/Image'
import { cn } from '~/util/cn'

type Props = Omit<ImageProps, 'image'> &
  (
    | {
        image?: never
        movie: Movie
      }
    | {
        image: Media
        movie?: never
      }
  )

export const Poster: React.FC<Props> = ({ movie, image, className, ...props }) => (
  <Image
    {...props}
    className={cn('md:max-w-[260px]', className)}
    image={movie ? ((movie as Movie).poster as Media) : image}
    alt={props.alt ?? 'poster'}
    srcSet={[
      { options: { width: 260 }, size: '260w' },
      { options: { width: 520 }, size: '520w' },
    ]}
    sizes="260px"
  />
)
