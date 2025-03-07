import type { Media } from '@app/types/payload'
import type { BackendBrowserEnvironment } from '@app/util/env'
import { getMediaUrl } from './getMediaUrl'

type Options = {
  quality?: number
  format?: 'auto' | 'webp' | 'jpeg' | 'png' | 'gif' | 'auto'
  width?: number
  height?: number
  fit?: 'clip' | 'crop' | 'scale' | 'max' | 'min'
}
const defaultOptions: Options = {
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
  env?: BackendBrowserEnvironment,
  options?: Options,
) => {
  // get the absolute url of the media
  if (typeof src === 'object') {
    src = getMediaUrl(src, env) as string
  }

  // do not optimize in development
  if (env?.NODE_ENV === 'development') {
    return src
  }

  // build the options string
  options = { ...defaultOptions, ...options }
  const optionsString = Object.entries(options)
    .map(([key, value]) => `${key}=${value}`)
    .join(',')

  // construct the url
  return `${env?.CDN_CGI_IMAGE_URL}/${optionsString}/${encodeURI(src)}`
}
