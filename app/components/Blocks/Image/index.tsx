import React from 'react';
import classes from './index.module.css';
import { Image as ImageComponent } from '~/components/Image';
import type { Media } from 'payload/generated-types';

export type Type = {
  blockType: 'image'
  blockName?: string
  image?: Media | string
}

export const Image: React.FC<Type> = ({ image }) => {
  return image as Media ? (
    <div className={classes.container}>
      <ImageComponent
        image={image as Media}
        srcSet={[
          { size: 'landscape-2560w', width: 2560 },
          { size: 'landscape-1280w', width: 1024 },
          { size: 'square-768w', width: 768 },
          { size: 'square-512w', width: 512 },
        ]}
        sizes={[
          '95vw',
        ]}
      />
    </div>
  ) : (<></>)
};

export default Image;