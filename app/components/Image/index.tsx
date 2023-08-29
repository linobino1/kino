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

export interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  image: ImageType
  srcset_?: SrcSet
  sizes_?: string[]
  loader?: ImageLoader
}

/**
 * get srcSet string from srcSet array
 * @param image Media
 * @param srcSet [{ size: '2560w', width: 2560 }, { size: '1500w', width: 1920 }]
 * @returns "https://example.com/2560w.jpg 2560w, https://example.com/1500w.jpg 1500w"
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

export const Image: React.FC<Props> = (props) => {
  // default loader is mediaUrl
  const loader = props.loader || mediaUrl;
  const { image, alt, srcset_, sizes_ } = props;
  const srcSet = props.srcSet || getSrcSetString(loader, image, srcset_);
  const sizes = props.sizes || getSizesString(sizes_);

  return image ? (
    <img
      src={image.filename && loader(image.filename)}
      alt={alt || image.alt || ''}
      srcSet={srcSet}
      sizes={sizes}
      {...props}
    />
  ) : null;
}

export default Image;
