import { mediaPopulate } from './mediaPopulate'

export const postsListQuery = {
  select: {
    updatedAt: true,
    createdAt: true,
    title: true,
    date: true,
    header: true,
    content: true,
    slug: true,
  },
  where: {
    _status: {
      equals: 'published',
    },
  },
  draft: false,
  sort: '-date',
  depth: 1,
  populate: {
    media: mediaPopulate,
  },
} as const
