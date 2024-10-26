import { Media } from '@/payload-types'
import { MetaDescriptor } from '@remix-run/react'
import { generateTitle } from './generateTitle'
import { getOptimizedImageUrl } from './media/getOptimizedImageUrl'
import type { ClientEnvironment } from '~/env.server'

type Props = {
  title?: string | null
  description?: string | null
  image?: Media | string | null
  env?: ClientEnvironment
}

export const generateMetadata = ({ title, description, image, env }: Props): MetaDescriptor[] => {
  let res: MetaDescriptor[] = [{ title: generateTitle(title) }]

  if (description) {
    res = res.concat([
      { name: 'description', content: description },
      {
        tagName: 'meta',
        name: 'og:description',
        content: description,
      },
    ])
  }

  if (image) {
    const imageUrl =
      typeof image === 'string' ? image : getOptimizedImageUrl(image as Media, env, { width: 1200 })
    res = res.concat([
      {
        tagName: 'meta',
        name: 'og:image',
        content: imageUrl,
      },
      {
        tagName: 'meta',
        name: 'twitter:image',
        content: imageUrl,
      },
    ])
  }

  return res
}
