import type { Media } from '@/payload-types'
import React from 'react'
import { getOptimizedImageUrl } from '~/util/media/getOptimizedImageUrl'
import { useEnv } from '~/util/useEnv'

/**
 * srcSet can either be used natively or by passing an array of  { options: cloudflare transformation options, width: css width }
 * e.g. { options: { width: 400, quality: 80 }, width: "500w" }
 */
export interface Props extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
  image?: Media
  srcSet?: { options: object; size: string }[] | string
}

export const Image: React.FC<Props> = ({ image, srcSet, src, alt, width, height, ...props }) => {
  const env = useEnv()

  // use src and alt from image if provided
  src ||= image?.url || undefined
  alt ||= image?.alt || undefined
  width ||= image?.width || undefined
  height ||= image?.height || undefined

  // transform srcSet array to string
  if (typeof srcSet === 'object') {
    srcSet = srcSet
      .map((item) => {
        return `${getOptimizedImageUrl(src as string, env, item.options)} ${item.size}`
      })
      .join(', ')
  }

  return <img {...props} src={src} alt={alt} width={width} height={height} srcSet={srcSet} />
}

export default Image
