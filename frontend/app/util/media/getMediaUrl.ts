import { Media } from '@/payload-types'
import { type ClientEnvironment } from '~/env.server'

/**
 *
 * @returns an absolute URL to the media file
 */
export const getMediaUrl = (media: Media | string, env?: ClientEnvironment) => {
  if (typeof media === 'string') {
    throw new Error('getMediaUrl() expects a Media object, but got a string')
  }

  // if the media url is already an absolute URL, return it
  if (media.url?.startsWith('http')) {
    return media.url
  }

  const baseUrl = env?.MEDIA_URL ?? env?.BACKEND_URL

  return `${baseUrl}${media.url}`
}
