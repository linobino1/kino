import React from 'react';
import type { Media } from 'payload/generated-types';
import Image from "~/components/Image";
import classes from "./index.module.css";

export type Type = {
  blockType: 'headerImage'
  blockName?: string
  image?: Media | string
}

export const HeaderImage: React.FC<Type> = ({ image }) => {
  return (
    <header className={classes.pageHeader}>
      { image as Media && (
        <div className={classes.imageHeader}>
          <Image
            className={classes.headerImage}
            image={image as Media}
            srcSet_={[
              { size: '2560x1706', width: 2560 },
              { size: '1920x1280', width: 1920 },
              { size: '1280x853', width: 1280 },
              { size: '768x768', width: 768 },
              { size: '512x512', width: 512 },
            ]}
            sizes_={[
              '95vw',
            ]}
          />
        </div>
      )}
    </header>
  )
};

export default HeaderImage;
