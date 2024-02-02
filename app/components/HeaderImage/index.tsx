import React from "react";
import type {
  Media,
  Navigation as NavigationType,
} from "payload/generated-types";
import Image from "~/components/Image";
import classes from "./index.module.css";
import { Navigation } from "~/components/Navigation";
import Gutter from "../Gutter";

export interface Type extends React.HTMLAttributes<HTMLDivElement> {
  image?: Media | string;
  navigation?: NavigationType | string | null;
  children?: React.ReactNode;
}

export const HeaderImage: React.FC<Type> = ({
  image,
  navigation,
  children,
  className,
  ...props
}) => {
  return (
    <header
      className={[className, classes.container].filter(Boolean).join(" ")}
      {...props}
    >
      {(image as Media) && (
        <Image className={classes.header} image={image as Media} />
      )}
      <div className={classes.overlay} />
      <Gutter className={classes.content}>
        {(navigation as NavigationType) && (
          <Navigation
            navigation={navigation as NavigationType}
            className={classes.navSocial}
          />
        )}
        {children}
      </Gutter>
    </header>
  );
};

export default HeaderImage;
