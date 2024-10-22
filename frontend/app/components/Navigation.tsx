import React from 'react'
import type { StaticPage, Media, Navigation as NavigationType } from '@/payload-types'
import { Image } from '~/components/Image'
import LanguageSwitch from '~/components/LanguageSwitch'
import { NavLink } from '~/components/localized-link/NavLink'
import { cn } from '~/util/cn'

type Props = {
  navigation?: NavigationType
  className?: string
  isChild?: boolean
}

export const navItemClassName = 'px-4 py-4 md:py-2 hover:text-black'

export const Navigation: React.FC<Props> = ({ navigation, isChild = false, className }) => {
  const _navItemClassName = navItemClassName

  // each item renders as either an internal link, an external link with an icon or text, or another navigation
  return navigation ? (
    <nav className={cn('flex flex-wrap', className)}>
      {navigation?.items?.map((item) => {
        if (item.type === 'language') {
          return <LanguageSwitch key={item.id} className={_navItemClassName} />
        }

        const href =
          item.relPath ||
          ((item.page as StaticPage) ? `/${(item.page as StaticPage).slug}` : item.url)

        // image or plain text
        const inner: React.ReactNode = item.icon ? (
          <Image image={item.icon as Media} className="h-[1.4rem] w-auto" />
        ) : (
          item.name
        )

        // subnavigation or link
        return (
          <React.Fragment key={item.id}>
            {item.type === 'subnavigation' ? (
              <div className="group relative cursor-pointer max-md:contents">
                <div
                  className={cn(_navItemClassName, {
                    'text-gray-400 after:ml-2 after:inline-block after:w-4 after:text-center after:text-[0.8em] max-md:after:content-["▼"]':
                      item.subnavigation,
                  })}
                >
                  {inner}
                </div>
                <div
                  className={cn(
                    'w-max max-w-md bg-white transition-all md:pointer-events-none md:absolute md:opacity-0',
                    'group-hover:pointer-events-auto group-hover:opacity-100',
                  )}
                >
                  <Navigation
                    navigation={item.subnavigation as NavigationType}
                    className="flex-col max-md:items-end"
                    isChild
                  />
                </div>
              </div>
            ) : (
              <NavLink
                to={href as string}
                className={({ isActive }) =>
                  cn(_navItemClassName, {
                    'text-black hover:text-inherit': isActive,
                    'after:ml-2 after:inline-block after:w-4 after:text-center after:text-[0.8em] after:text-gray-400 max-md:after:content-["|"]':
                      isChild,
                  })
                }
                target={item.newTab ? '_blank' : undefined}
                prefetch="intent"
              >
                {inner}
              </NavLink>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  ) : (
    <></>
  )
}

export default Navigation
