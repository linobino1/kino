import type { Post, Media } from '@app/types/payload'
import React from 'react'
import { Date } from '~/components/Date'
import { Image } from '~/components/Image'
import { RichText } from '~/components/RichText'
import { useTranslation } from 'react-i18next'
import type { LinkableCollection } from '@app/payload/types'
import { Link } from '~/components/localized-link'
import { cn } from '@app/util/cn'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

export const PostPreview: React.FC<Props> = ({ className, ...props }) => {
  const { t } = useTranslation()
  const { post } = props
  const imageLink =
    post.link?.type === 'internal'
      ? (post.link.doc?.value as LinkableCollection)?.url
      : post.link?.type === 'external'
        ? post.link?.url
        : post.details?.length
          ? post.url
          : undefined

  const image = (
    <Image
      image={post.header as Media}
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
      {imageLink ? (
        <Link
          to={imageLink}
          target={post.link?.type === 'external' ? '_blank' : '_self'}
          prefetch={post.link?.type === 'external' ? 'none' : 'intent'}
          localize={post.link?.type !== 'external'}
        >
          {image}
        </Link>
      ) : (
        image
      )}
      <div className="max-sm:mt-4">
        <Date className="text-sm" date={post.date} format="PPP" />
        <h2 className="mb-4 mt-1 break-words text-2xl font-semibold uppercase">{post.title}</h2>
        <RichText content={post.content} />
        {post.details?.length ? (
          <Link
            to={post.url ?? ''}
            prefetch={'intent'}
            className="mt-4 inline-block text-sm underline"
          >
            {t('Read more')}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
