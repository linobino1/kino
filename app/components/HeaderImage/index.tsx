import React from 'react';
import type { Media, Navigation as NavigationType } from 'payload/generated-types';
import Image from "~/components/Image";
import classes from "./index.module.css";
import { Navigation } from '~/components/Navigation';

export type Type = {
  image?: Media | string
  navigation?: NavigationType | string
  children?: React.ReactNode
}

export const HeaderImage: React.FC<Type> = ({ image, navigation, children }) => {
  return (
    <header className={classes.container}>
      { image as Media && (
        <Image
          className={classes.header}
          image={image as Media}
        />
      )}
      <div className={classes.overlay} />
      <div className={classes.content}>
        { navigation as NavigationType && (
          <Navigation
            navigation={navigation as NavigationType}
            className={classes.navSocial}
          />
        )}
        { children }
      </div>
    </header>
  )
};

export default HeaderImage;
