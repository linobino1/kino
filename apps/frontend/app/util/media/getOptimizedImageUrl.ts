import type { Media } from '@app/types/payload'
import type { FrontendBrowserEnvironment } from '@app/util/env'
import { getMediaUrl } from './getMediaUrl'

const defaultOptions = {
  quality: 85,
  format: 'auto',
}

/**
 * this function is used to get the optimized image url from cloudflare
 * @param src media object or relative url or absolute url - if media object or relative url is passed, it will be converted to absolute url relative to MEDIA_URL or BACKEND_URL
 * @param options cloudflare transformation options
 * @returns optimized image url from cloudflare
 */
export const getOptimizedImageUrl = (
  src: string | Media,
  env?: FrontendBrowserEnvironment,
  options?: object,
) => {
  // get the absolute url of the media
  if (typeof src === 'object') {
    src = getMediaUrl(src, env) as string
  }

  // build the options string
  options = { ...defaultOptions, ...options }
  const optionsString = Object.entries(options)
    .map(([key, value]) => `${key}=${value}`)
    .join(',')

  // construct the url
  return `${env?.CDN_CGI_IMAGE_URL}/${optionsString}/${encodeURI(src)}`
}
