import React from 'react'
import type { StaticPage, Media, Navigation as NavigationType } from '@/payload-types'
import { Image } from '~/components/Image'
import LanguageSwitch from '~/components/LanguageSwitch'
import { NavLink } from '~/components/localized-link/NavLink'
import { classes } from '~/classes'

type Props = {
  navigation?: NavigationType
  className?: string
  dataType?: string
}

export const Navigation: React.FC<Props> = ({ navigation, className, dataType }) => {
  // each item renders as either an internal link, an external link with an icon or text, or another navigation
  return navigation ? (
    <nav className={`${classes.nav} ${className}`} data-type={dataType || navigation.type}>
      {navigation?.items?.map((item) => {
        if (item.type === 'language') {
          return (
            <LanguageSwitch key={item.id} className={`${classes.navItem} ${classes.language}`} />
          )
        }

        const href =
          item.relPath ||
          ((item.page as StaticPage) ? `/${(item.page as StaticPage).slug}` : item.url)

        // image or plain text
        const inner: React.ReactNode = item.icon ? (
          <Image image={item.icon as Media} className={classes.image} />
        ) : (
          <span>{item.name}</span>
        )

        // subnavigation or link
        return (
          <div key={item.id} style={{ display: 'contents' }}>
            {item.type === 'subnavigation' ? (
              <div className={classes.subnavHost}>
                <div className={classes.navItem}>{inner}</div>
                <div className={classes.subnav}>
                  <Navigation
                    navigation={item.subnavigation as NavigationType}
                    className={classes.subnav}
                  />
                </div>
              </div>
            ) : (
              <NavLink
                to={href as string}
                className={({ isActive }) => `${classes.navItem} ${isActive && classes.active}`}
                target={item.newTab ? '_blank' : undefined}
                prefetch="intent"
              >
                {inner}
              </NavLink>
            )}
          </div>
        )
      })}
    </nav>
  ) : (
    <></>
  )
}

export default Navigation
