import React from 'react'
import type { Media, Navigation as NavigationType } from '@/payload-types'
import { Image } from '~/components/Image'
import { Navigation } from '~/components/Navigation'
import { Gutter } from '~/components/Gutter'
import { classes } from '~/classes'

export interface Type extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  id?: string | undefined | null
  image?: Media | string
  navigation?: NavigationType | string | null
  children?: React.ReactNode
}

export const HeaderImage: React.FC<Type> = ({
  id,
  image,
  navigation,
  children,
  className,
  ...props
}) => {
  return (
    <header
      className={[className, classes.container].filter(Boolean).join(' ')}
      {...props}
      id={id || undefined}
    >
      {(image as Media) && (
        <Image
          className={classes.header}
          image={image as Media}
          srcSet={[
            { options: { width: 500 }, size: '500w' },
            { options: { width: 768 }, size: '768w' },
            { options: { width: 1500 }, size: '1500w' },
            { options: { width: 2560 }, size: '2560w' },
          ]}
          sizes="100vw"
        />
      )}
      <div className={classes.overlay} />
      <div className={classes.content}>
        {(navigation as NavigationType) && (
          <Gutter size="large" className={classes.navGutter}>
            <Navigation navigation={navigation as NavigationType} className={classes.navSocial} />
          </Gutter>
        )}
        <Gutter>{children}</Gutter>
      </div>
    </header>
  )
}

export default HeaderImage
