import React from 'react'
import type { Media } from '@/payload-types'
import { Image } from '~/components/Image'
import Slider from './Slider'
// import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
// import { Carousel } from 'react-responsive-carousel'

export type Type = {
  images: Media[]
}

export const Gallery: React.FC<Type> = ({ images }) => {
  return (
    <div className="my-6">
      {/* <Carousel showArrows={true} showStatus={false} showThumbs={false} showIndicators={false}> */}
      <Slider>
        {images.map((image, index) => (
          <Image
            key={index}
            className="aspect-[3/2] h-full object-contain"
            image={image as Media}
            srcSet={[
              { options: { width: 500 }, size: '500w' },
              { options: { width: 720 }, size: '720w' },
              { options: { width: 1440 }, size: '1440w' },
            ]}
            sizes="(max-width: 768px) 100vw, 720px"
          />
        ))}
      </Slider>
      {/* </Carousel> */}
    </div>
  )
}

export default Gallery
