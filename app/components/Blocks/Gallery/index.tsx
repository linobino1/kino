import React from 'react';
import type { Media } from 'payload/generated-types';
import classes from "./index.module.css";
import Image from '~/components/Image';
import carouselStyles from "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export type Type = {
  images?: {
    image?: Media | string
    id?: string
  }[]
}

export const HeaderImage: React.FC<Type> = ({ images }) => {
  return images ? (
  <>
    <link rel="stylesheet" href={carouselStyles} />
    <div className={classes.container}>
      <Carousel
        showArrows={true}
        showStatus={false}
      >
          { images.map((item) => (
              <div key={item.id}>
                  <Image
                    className={classes.image}
                    image={item.image as Media}
                    alt={(item.image as Media)?.alt}
                  />
              </div>
          ))}
      </Carousel>
    </div>
  </>
  ) : null;
};

export default HeaderImage;
