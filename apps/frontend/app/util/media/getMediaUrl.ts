import type { Media } from '@app/types/payload'
import type { FrontendBrowserEnvironment } from '@app/util/env'

/**
 *
 * @returns an absolute URL to the media file
 */
export const getMediaUrl = (media: Media | string, env?: FrontendBrowserEnvironment) => {
  if (typeof media === 'string') {
    throw new Error(`getMediaUrl() expects a Media object, but got a string ${media}`)
  }

  // if the media url is already an absolute URL, return it
  if (media.url?.startsWith('http')) {
    return media.url
  }

  const baseUrl = env?.MEDIA_URL ?? env?.BACKEND_URL

  return `${baseUrl}${media.url}`
}
