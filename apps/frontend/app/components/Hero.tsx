import type { Media, Navigation as NavigationType, Page } from '@app/types/payload'
import { Image } from './Image'
import { Gutter } from './Gutter'
import { Navigation } from './Navigation'
import { useMatches } from 'react-router'
import { cn } from '@app/util/cn'

type Props = React.HTMLAttributes<HTMLDivElement> &
  Omit<NonNullable<Page['hero']>, 'type'> & {
    type?: 'none' | 'image' | 'headline' | 'overlay' | null // type 'overlay' cannot be selected in the CMS
    socialNavigation?: NavigationType
  }

export const Hero: React.FC<Props> = ({ type, headline, image, children, className, ...props }) => {
  if (!type) type = 'none'
  const matches = useMatches()
  const layoutData = matches.find((match) => match.id === '($lang)._main')?.data as
    | {
        navigations: NavigationType[]
      }
    | undefined
  const socialNavigation = layoutData?.navigations?.find((nav) => nav.type === 'socialMedia')

  if (type === 'none') return null

  return (
    <div className={className} {...props}>
      {['image', 'overlay'].includes(type) && image && (
        <div className="relative aspect-[16/9] max-h-[55vh] w-screen overflow-hidden">
          <Image
            image={image as Media}
            srcSet={[
              { options: { width: 500 }, size: '500w' },
              { options: { width: 768 }, size: '768w' },
              { options: { width: 1500 }, size: '1500w' },
              { options: { width: 2560 }, size: '2560w' },
            ]}
            sizes="100vw"
            fetchPriority="high"
            className="h-full w-full object-cover object-[center_33%]"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex h-full flex-col justify-between sm:py-4">
            <Gutter size="large" className="flex justify-end">
              <Navigation navigation={socialNavigation} className="translate-x-4" />
            </Gutter>
            {type === 'overlay' && <Gutter className="max-sm:pb-4">{children}</Gutter>}
          </div>
        </div>
      )}
      {['headline', 'image'].includes(type) && headline && (
        <h1
          className={cn(
            'break-words text-center text-4xl font-semibold uppercase leading-tight tracking-widest',
            {
              'mb-8 bg-white p-2 text-black': type === 'image',
              'my-[1.5em]': type === 'headline',
            },
          )}
        >
          {headline}
        </h1>
      )}
    </div>
  )
}
