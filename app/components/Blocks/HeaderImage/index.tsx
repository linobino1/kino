import React from 'react';
import type { Navigation as NavigationType } from 'payload/generated-types';
import type { Media } from 'payload/generated-types';
import Image from "~/components/Image";
import classes from "./index.module.css";
import { Navigation } from '~/components/Navigation';

export type Type = {
  blockType: 'headerImage'
  blockName?: string
  image?: Media | string
  navigation?: NavigationType
}

export const HeaderImage: React.FC<Type> = ({ image, navigation }) => {
  return (
    <header className={classes.pageHeader}>
      { image as Media && (
        <div className={classes.imageHeader}>
          <Image
            className={classes.headerImage}
            image={image as Media}
            srcset_={[
              { size: '2560w', width: 2560 },
              { size: '1500w', width: 1920 },
              { size: '1000w', width: 1280 },
            ]}
            sizes_={[
              '95vw',
            ]}
          />
        </div>
      )}
      <div className={classes.overlay}>
        { navigation && (
          <Navigation
            navigation={navigation}
            className={classes.navSocial}
          />
        )}
      </div>
    </header>
  )
};

export default HeaderImage;
