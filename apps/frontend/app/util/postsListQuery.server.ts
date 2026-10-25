export const postsListQuery = {
  select: {
    updatedAt: true,
    createdAt: true,
    title: true,
    date: true,
    header: true,
    link: {
      type: true,
      doc: true,
      url: true,
    },
    content: true,
    hasDetailPage: true,
    url: true,
  },
  where: {
    _status: {
      equals: 'published',
    },
  },
  draft: false,
  sort: '-date',
  depth: 1,
} as const
