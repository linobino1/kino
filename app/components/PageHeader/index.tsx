import Image from "../Image";
import classes from "./index.module.css";
import type { Media } from "payload/generated-types";
import React from "react";

export type Type = {
  image?: Media | string
}

export const PageHeader: React.FC<Type> = ({ image }) => (
  <header className={classes.pageHeader}>
    { image as Media && (
      <div className={classes.imageHeader}>
        <Image
          className={classes.headerImage}
          image={image as Media}
          srcSet={[
            { size: 'landscape-2560w', width: 2560 },
            { size: 'landscape-1920w', width: 1920 },
            { size: 'landscape-1280w', width: 1280 },
            { size: 'square-768w', width: 768 },
            { size: 'square-512w', width: 512 },
          ]}
          sizes={[
            '95vw',
          ]}
        />
      </div>
    )}
  </header>
);

export default PageHeader;
