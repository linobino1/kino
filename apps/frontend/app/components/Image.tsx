import type { Media } from '@app/types/payload'
import React from 'react'
import { getMediaUrl } from '@app/util/media/getMediaUrl'
import { getOptimizedImageUrl } from '@app/util/media/getOptimizedImageUrl'
import { getObjectPosition } from '@app/util/media/getObjectPosition'
import { useEnv } from '~/util/useEnv'

/**
 * srcSet can either be used natively or by passing an array of  { options: cloudflare transformation options, width: css width }
 * e.g. { options: { width: 400, quality: 80 }, width: "500w" }
 */
export interface Props extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
  image?: Media
  srcSet?: { options: object; size: string }[] | string
  applyFocalPoint?: boolean
}

export const Image: React.FC<Props> = ({
  image,
  srcSet,
  src,
  alt,
  width,
  height,
  applyFocalPoint = true,
  ...props
}) => {
  const env = useEnv()

  // use src and alt from image if provided
  src ||= image ? getMediaUrl(image, env) : undefined
  alt ||= image?.alt || undefined
  width ||= image?.width || undefined
  height ||= image?.height || undefined

  // transform srcSet array to string
  if (typeof srcSet === 'object' && env?.CDN_CGI_IMAGE_URL) {
    srcSet = srcSet
      .map((item) => {
        return `${getOptimizedImageUrl(src as string, env, item.options)} ${item.size}`
      })
      .join(', ')
  } else {
    srcSet = undefined
  }

  let objectPosition = undefined
  if (typeof image === 'object' && applyFocalPoint) {
    objectPosition = getObjectPosition(image)
  }

  return (
    <img
      style={{ objectPosition }}
      {...props}
      src={src}
      alt={alt}
      width={width}
      height={height}
      srcSet={srcSet}
    />
  )
}
