import { LRUCache } from 'lru-cache'
import type { CacheEntry, Cache, CachifiedOptions } from '@epic-web/cachified'
import { cachified, totalTtl } from '@epic-web/cachified'

/* lru cache is not part of this package but a simple non-persistent cache */
const lruInstance = new LRUCache<string, CacheEntry>({ max: 1000 })

const lru: Cache = {
  set(key, value) {
    const ttl = totalTtl(value?.metadata)
    return lruInstance.set(key, value, {
      ttl: ttl === Infinity ? undefined : ttl,
      start: value?.metadata?.createdTime,
    })
  },
  get(key) {
    return lruInstance.get(key)
  },
  delete(key) {
    return lruInstance.delete(key)
  },
}

export function cache<Value>(options: Omit<CachifiedOptions<Value>, 'cache'>) {
  return cachified({
    cache: lru,
    ...options,
  })
}
