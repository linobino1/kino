import type { Media } from "payload/generated-types"
import React from "react"
import { mediaUrl } from "~/util/mediaUrl"

export type Props = {
  image: Media
  width?: number
  height?: number
  className?: string
  fill?: boolean
  srcSet?: { size: keyof Required<Media>['sizes']; width: number }[]
  sizes?: string[]
}

export const Image: React.FC<Props> = ({
  width, height, className, image, srcSet, sizes
}) => {
  const srcSetClean = srcSet?.map((item) => {
    if (image.sizes === undefined || image.sizes[item.size] === undefined) {
      return undefined;
    }
    return `${mediaUrl(image.sizes[item.size]?.filename as string)} ${image.sizes[item.size]?.width}w`;
  }).filter(Boolean).join(', ');

  return (
    <img
      src={mediaUrl(image.filename as string)}
      alt={image.alt}
      width={width}
      height={height}
      className={className}
      srcSet={srcSetClean}
      sizes={sizes && sizes.join(', ')}
    />
  )
}

export default Image;
