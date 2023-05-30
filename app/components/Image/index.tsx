import type { Media } from "payload/generated-types"
import React from "react"
import { mediaUrl } from "~/util/mediaUrl"

/**
 * can be used for Poster, Still, and Media. Alt is optional.
 */
export interface ImageType extends Omit<Media, 'alt'> {
  alt?: string
}

export type ImageLoader = (filename: string) => string;

export type SrcSet = {
  size: keyof Required<ImageType>['sizes']
  width: number 
}[]

export type Props = {
  image: ImageType
  width?: number
  height?: number
  className?: string
  fill?: boolean
  srcSet?: SrcSet
  sizes?: string[]
  alt?: string
  loader?: ImageLoader
}

/**
 * get srcSet string from srcSet array
 * @param image Media
 * @param srcSet [{ size: '2560x1706', width: 2560 }, { size: '1920x1280', width: 1920 }]
 * @returns "https://example.com/2560x1706.jpg 2560w, https://example.com/1920x1280.jpg 1920w"
 */
export const getSrcSetString = (loader: ImageLoader, image: ImageType, srcSet?: SrcSet): string => {
  return (srcSet || []).map((item) => {
    if (
      image.sizes === undefined
      || image.sizes[item.size] === undefined
      || image.sizes[item.size]?.filename === undefined
      || typeof image.sizes[item.size]?.filename !== 'string'
    ) {
      return undefined;
    }
    return `${loader(image.sizes[item.size]?.filename as string)} ${image.sizes[item.size]?.width}w`;
  }).filter(Boolean).join(', ');
}

/**
 * get sizes string from sizes array
 * @param sizes ['95vw', '50vw']
 * @returns "95vw, 50vw"
 */
export const getSizesString = (sizes?: string[]): string => sizes?.join(', ') || '';

export const Image: React.FC<Props> = ({
  width, height, className, image, srcSet, sizes, alt, loader,
}) => {
  // default loader is mediaUrl
  const _loader = loader || mediaUrl;

  return image ? (
    <img
      src={image.filename && _loader(image.filename)}
      alt={alt || image.alt || ''}
      width={width}
      height={height}
      className={className}
      srcSet={getSrcSetString(_loader, image, srcSet)}
      sizes={getSizesString(sizes)}
    />
  ) : null;
}

export default Image;
