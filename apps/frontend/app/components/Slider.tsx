import type { Settings } from 'react-slick'
import SlickSlider from 'react-slick'
import React, { useRef } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { cn } from '@app/util/cn'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  maxSlidesToShow?: number
  autoplay?: boolean
  autoplaySpeed?: number
}

// @ts-expect-error necessary
const SliderComponent = SlickSlider.default ?? SlickSlider

export const Slider: React.FC<Props> = ({
  maxSlidesToShow = 1,
  autoplay = false,
  autoplaySpeed = 5000,
  className,
  ...props
}) => {
  const sliderRef = useRef<any>(null)

  const settings: Settings = {
    infinite: true,
    speed: 1000,
    autoplay,
    autoplaySpeed,
    slidesToShow: Math.min(3, maxSlidesToShow),
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, maxSlidesToShow),
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  const Arrow: React.FC<{
    type: 'next' | 'prev'
  }> = ({ type }) => {
    return (
      <div
        onClick={() =>
          type === 'next' ? sliderRef.current?.slickNext() : sliderRef.current?.slickPrev()
        }
        className={cn(
          'pointer-events-auto flex aspect-square h-12 cursor-pointer items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-black/30',
        )}
      >
        <div
          className={cn('i-material-symbols:play-arrow text-lg', {
            'rotate-180 transform': type === 'prev',
          })}
        />
      </div>
    )
  }

  return (
    <div {...props} className={cn('relative w-full text-lg sm:text-2xl', className)}>
      <SliderComponent ref={sliderRef} {...settings}>
        {props.children}
      </SliderComponent>
      <div className="pointer-events-none absolute left-0 top-0 z-10 flex h-full w-full items-center justify-between">
        <Arrow type="prev" />
        <Arrow type="next" />
      </div>
    </div>
  )
}
