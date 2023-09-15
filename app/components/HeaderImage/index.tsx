import React from 'react';
import type { Media, Navigation as NavigationType } from 'payload/generated-types';
import Image from "~/components/Image";
import classes from "./index.module.css";
import { Navigation } from '~/components/Navigation';

export type Type = {
  image?: Media | string
  navigation?: NavigationType | string
}

export const HeaderImage: React.FC<Type> = ({ image, navigation }) => {
  return (
    <header className={classes.container}>
      { image as Media && (
        <Image
          className={classes.header}
          image={image as Media}
        />
      )}
      <div className={classes.overlay}>
        { navigation as NavigationType && (
          <Navigation
            navigation={navigation as NavigationType}
            className={classes.navSocial}
          />
        )}
      </div>
    </header>
  )
};

export default HeaderImage;
