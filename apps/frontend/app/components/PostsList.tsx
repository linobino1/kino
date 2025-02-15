import type { Post } from '@app/types/payload'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { JsonLd } from '~/structured-data'
import { cn } from '@app/util/cn'
import { postsListSchema } from '~/structured-data/post'
import { PostPreview } from './PostPreview'
import { Pagination } from './Pagination'
import type { PaginatedDocs } from 'payload'

export interface Props extends React.HTMLAttributes<HTMLUListElement> {
  posts: PaginatedDocs<Post>
  className?: string
  pagination?: boolean
}

export const PostsList: React.FC<Props> = ({ posts, pagination = true, className, ...props }) => {
  const { t } = useTranslation()

  return posts?.docs.length ? (
    <>
      <ul {...props} className={cn(className)}>
        <JsonLd {...postsListSchema(posts.docs)} />
        {posts.docs.map((post, index) => (
          <PostPreview key={index} post={post} className="py-8" />
        ))}
      </ul>
      {pagination && <Pagination className="my-8" {...posts} linkProps={{ prefetch: 'intent' }} />}
    </>
  ) : (
    <div className="flex min-h-[50vh] items-center justify-center">{t('No posts.')}</div>
  )
}
