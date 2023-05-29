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
            { size: '2560x1706', width: 2560 },
            { size: '1920x1280', width: 1920 },
            { size: '1280x853', width: 1280 },
            { size: '768x768', width: 768 },
            { size: '512x512', width: 512 },
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
