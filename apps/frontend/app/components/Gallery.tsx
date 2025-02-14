import React from 'react'
import type { Media } from '@app/types/payload'
import { Image } from '~/components/Image'
import Slider from './Slider'

export type Type = {
  images: Media[]
}

export const Gallery: React.FC<Type> = ({ images }) => {
  return (
    <div className="my-6">
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
    </div>
  )
}

export default Gallery
