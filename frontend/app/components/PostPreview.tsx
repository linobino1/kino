import type { Post, Media } from '@/payload-types'
import React from 'react'
import Date from '~/components/Date'
import Image from '~/components/Image'
import RichText from '~/components/RichText'
import { useTranslation } from 'react-i18next'
import type { LinkableCollection } from '@/types'
import { Link } from '~/components/localized-link'
import { cn } from '~/util/cn'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

export const PostPreview: React.FC<Props> = ({ className, ...props }) => {
  const { t } = useTranslation()
  const { post } = props
  let href: string | undefined | null
  let target = '_self'
  switch (post.link?.type) {
    case 'internal':
      href = (post.link.doc?.value as LinkableCollection)?.url
      break
    case 'external':
      href = post.link?.url ?? ''
      target = '_blank'
      break
    case 'none':
      href = post.details?.length ? post.url : undefined
  }

  const image = (
    <Image
      image={post.header as Media}
      onClick={href ? () => window.open(href, target) : undefined}
      className={cn('', {
        'cursor-pointer': href,
      })}
      srcSet={[
        { options: { width: 500 }, size: '500w' },
        { options: { width: 768 }, size: '768w' },
        { options: { width: 1000 }, size: '1000w' },
        { options: { width: 1500 }, size: '1500w' },
      ]}
      sizes="(max-width: 768px) 100vw, 500px"
    />
  )
  return (
    <div {...props} className={cn('gap-x-8 sm:grid sm:grid-cols-2', className)}>
      {href ? (
        <Link to={href} prefetch={post.link?.type === 'external' ? 'none' : 'intent'}>
          {image}
        </Link>
      ) : (
        image
      )}
      <div className="max-sm:mt-4">
        <Date className="text-sm" iso={post.date} format="PPP" />
        <h2 className="mb-4 mt-1 break-words text-2xl font-semibold uppercase">{post.title}</h2>
        <RichText content={post.content} />
        {post.details?.length ? (
          <Link className="mt-4 inline-block text-sm underline" to={post.url} prefetch="intent">
            {t('Read more')}
          </Link>
        ) : null}
      </div>
    </div>
  )
}

export default PostPreview
