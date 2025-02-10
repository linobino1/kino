import React, { useEffect, useState } from 'react'
import type { Media, Site, Navigation as NavigationType } from '@app/types/payload'
import { Navigation, navItemClassName } from './Navigation'
import { useLocation } from '@remix-run/react'
import { Image } from '~/components/Image'
import { UserStatus } from './UserStatus'
import { Hamburger } from './Hamburger'
import { Gutter } from './Gutter'
import { useTranslation } from 'react-i18next'
import { Link } from '~/components/localized-link'
import { cn } from '~/util/cn'
import LanguageSwitch from './LanguageSwitch'
import type { RequiredDataFromCollection } from 'payload'

type Props = {
  site: Site
  navigations: RequiredDataFromCollection<NavigationType>[]
}

const Header: React.FC<Props> = ({ site, navigations }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const toggleMenu = () => setMenuIsOpen((prev) => !prev)

  const { pathname } = useLocation()

  // close menu on navigation
  const { i18n } = useTranslation()
  useEffect(() => {
    setMenuIsOpen(false)
  }, [pathname, i18n.language])

  // lock body scroll when menu is open
  useEffect(() => {
    if (menuIsOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [menuIsOpen])

  const mainNavigation = navigations.find((x) => x.type === 'main')
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white text-sm uppercase text-gray-500">
        <Gutter
          size="large"
          className="grid grid-cols-[min-content_1fr_min-content] items-center py-2"
        >
          <Link className="contents" to="/" prefetch="intent">
            {(site.logo as Media) && (
              <Image
                className="max-w-unset h-auto w-32 max-md:hidden"
                image={site.logo as Media}
                width={200}
                height={50}
              />
            )}
            {(site.logoMobile as Media) && (
              <Image
                className="max-w-unset h-[min(1.2rem,6vw)] w-auto md:hidden"
                image={site.logoMobile as Media}
                width={200}
                height={50}
              />
            )}
          </Link>
          <button
            className="justify-self-end bg-transparent outline-none md:hidden"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <Hamburger collapsed={menuIsOpen} />
          </button>
          <Navigation
            navigation={mainNavigation}
            className="justify-self-end border-r border-gray-300 max-md:hidden"
          />
          <nav className="flex items-center">
            <UserStatus className={cn('text-nowrap pl-3 max-md:hidden')} />
            <LanguageSwitch className={'pl-4 max-md:hidden'} />
          </nav>
        </Gutter>
      </header>
      <div
        className={cn(
          'z-60 fixed z-40 flex h-full min-h-screen w-screen flex-col items-end overflow-y-auto bg-white pb-16 pt-14 text-2xl transition-opacity duration-500 md:hidden',
          {
            'pointer-events-none opacity-0': !menuIsOpen,
            'pointer-events-auto opacity-100': menuIsOpen,
          },
        )}
        aria-hidden={!menuIsOpen}
      >
        <LanguageSwitch className={navItemClassName} />
        <Navigation navigation={mainNavigation} className="flex-col items-end" />
        <UserStatus className={navItemClassName} />
      </div>
    </>
  )
}

export default Header
