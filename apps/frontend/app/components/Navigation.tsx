import React from 'react'
import type { Media, Navigation as NavigationType, Page } from '@app/types/payload'
import { Image } from '~/components/Image'
import { NavLink } from '~/components/localized-link/NavLink'
import { cn } from '@app/util/cn'
import type { RequiredDataFromCollection } from 'payload'

type Props = {
  navigation?: RequiredDataFromCollection<NavigationType>
  className?: string
  isChild?: boolean
  condensed?: boolean
}

export const navItemClassName = 'px-4 py-4 md:py-2 hover:text-black w-fit h-fit'

export const Navigation: React.FC<Props> = ({
  navigation,
  condensed = false,
  isChild = false,
  className,
}) => {
  const _navItemClassName = cn(navItemClassName, {
    'py-0 md:py-0 px-3': condensed,
  })

  // each item renders as either an internal link, an external link with an icon or text, or another navigation
  return navigation ? (
    <nav className={cn('flex flex-wrap', className)}>
      {navigation?.items?.map((item) => {
        if (item.type === 'language') {
          return null
        }

        const href =
          item.relPath || ((item.page as Page) ? `/${(item.page as Page).slug}` : item.url)

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
                    'text-gray-400 after:ml-2 after:inline-block after:min-w-4 after:text-center after:text-[0.8em] after:text-gray-300 max-md:after:content-["▼"]':
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
                    'after:ml-2 after:inline-block after:min-w-4 after:text-center after:text-[0.8em] after:text-gray-300 max-md:py-2 max-md:after:content-["|"]':
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
