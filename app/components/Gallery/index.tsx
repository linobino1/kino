import React from "react";
import type { Media } from "payload/generated-types";
import classes from "./index.module.css";
import Image from "~/components/Image";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

export type Type = {
  images?:
    | {
        image: Media | string;
        id?: string | null;
      }[]
    | null;
};

export const Gallery: React.FC<Type> = ({ images }) => {
  return images ? (
    <>
      {/* <link rel="stylesheet" href={carouselStyles} /> */}
      <div className={classes.container}>
        <Carousel
          showArrows={true}
          showStatus={false}
          showThumbs={false}
          showIndicators={false}
        >
          {images.map((item) => (
            <div key={item.id}>
              <Image
                className={classes.image}
                image={item.image as Media}
                alt={(item.image as Media)?.alt as string}
                srcSet={[
                  { options: { width: 500 }, size: "500w" },
                  { options: { width: 720 }, size: "720w" },
                  { options: { width: 1440 }, size: "1440w" },
                ]}
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </>
  ) : null;
};

export default Gallery;
