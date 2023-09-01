import type { Media } from "payload/generated-types"
import React from "react"

export interface SrcSetItem {
  size: keyof Required<Media>['sizes']
  css?: string
}
export interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  image: Media
  srcset_?: SrcSetItem[]
}

/**
 * get srcSet string from srcSet array
 * @param image Media
 * @param srcSet [{ size: '2560w', css: 2560 }, { size: '1500w', css: '2x' }]
 */
export const getSrcSetString = (image: Media, srcset: SrcSetItem[]): string => {
  return (srcset || []).map((item) => {
    const cropped = image.sizes?.[item.size];
    return cropped && cropped.url && [encodeURI(cropped.url || ''), item.css].filter(Boolean).join(' ');
  }).filter(Boolean).join(', ');
}

export const Image: React.FC<Props> = (props) => {
  const { image, alt } = props;
  const srcset_ = props.srcset_ || Object.keys(image.sizes || {}).map((key) => {
    const item = image.sizes?.[key as keyof Required<Media>['sizes']];
    return item?.url && {
      size: key as keyof Required<Media>['sizes'],
      css: `${item?.width}w`,
    }
  }).filter(Boolean) as SrcSetItem[];
  const srcSet = props.srcSet || getSrcSetString(image, srcset_);

  return image ? (
    <img
      src={image.url}
      alt={alt || image.alt || ''}
      srcSet={srcSet}
      {...props}
    />
  ) : null;
}

export default Image;
