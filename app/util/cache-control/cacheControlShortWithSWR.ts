/**
 * cache for 5 minutes, and allow stale data to be served while revalidating for 1h
 */
export const cacheControlShortWithSWR = `public, max-age=${60 * 5}, s-maxage=${
  60 * 5
}, stale-while-revalidate=${60 * 60}`;
