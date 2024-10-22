/**
 * cache for 1 minute, and allow stale data to be served while revalidating for 1 week
 */
export const cacheControlVeryShortCacheButLongSWR = `public, max-age=${
  60 * 1
}, s-maxage=${60 * 1}, stale-while-revalidate=${60 * 60 * 24 * 7}`
