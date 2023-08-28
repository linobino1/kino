import React from 'react';
import { Image as ImageComponent } from '~/components/Image';
import type { Media } from 'payload/generated-types';

export type Type = {
  blockType: 'image'
  blockName?: string
  image?: Media | string
}

export const Image: React.FC<Type> = ({ image }) => {
  return image as Media ? (
    <ImageComponent
      image={image as Media}
      srcset_={[
        { size: '2560x1706', width: 2560 },
        { size: '1280x853', width: 1024 },
        { size: '768x768', width: 768 },
        { size: '512x512', width: 512 },
      ]}
      sizes_={[
        '95vw',
      ]}
    />
  ) : (<></>)
};

export default Image;