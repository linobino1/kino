/**
 * cache for 5 minutes, and allow stale data to be served while revalidating for 1h
 */
export const cacheControlShortWithSWR = `public, max-age=0, s-maxage=0, stale-while-revalidate=${60 * 60}`
