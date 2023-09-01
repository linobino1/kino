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
    <header className={classes.container}>
      <div className={classes.wrapper}>
        { image as Media && (
          <Image
            className={classes.header}
            image={image as Media}
          />
        )}
      </div>
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
