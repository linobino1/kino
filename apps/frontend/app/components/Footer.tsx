import React from 'react'
import { Navigation } from './Navigation'
import { RichText } from './RichText'
import type { Navigation as NavigationType, Site } from '@app/types/payload'
import NewsletterSignup from './NewsletterSignup'
import Gutter from './Gutter'
import { Link } from '@remix-run/react'

export type Props = {
  site: Site
  navigations: NavigationType[]
}

export const Footer: React.FC<Props> = ({ site, navigations }) => {
  return (
    <footer className="border-t bg-neutral-500 py-12 text-white">
      <Gutter
        size="large"
        className="flex flex-col gap-x-4 gap-y-8 max-md:items-center md:grid md:grid-cols-[repeat(4,auto)] md:justify-between md:gap-y-4"
      >
        <RichText
          content={site.footerContent}
          className="max-md:order-3 max-md:text-center"
          enableMarginBlock={false}
        />
        <Navigation
          navigation={navigations.find((x) => x.type === 'footer')}
          className="flex-col gap-2 max-md:order-4 max-md:items-center"
          condensed
        />
        <Navigation
          navigation={navigations.find((x) => x.type === 'socialMedia')}
          className="gap-2 max-md:order-2 md:self-start"
          condensed
        />
        <NewsletterSignup className="w-[18em] max-md:order-1" />
        <div className="col-span-full my-8 flex flex-wrap items-center justify-evenly gap-[5vw] max-md:order-5 max-md:flex-col">
          <Link to="https://hfg-karlsruhe.de/" rel="noopener noreferrer" className="contents">
            <img
              src="/img/hfg.svg"
              alt="Hochschule für Gestaltung Karlsruhe"
              className="h-[60px] w-auto"
            />
          </Link>
          <img src="/img/asta.svg" alt="AstA HfG Karlsruhe" className="h-[40px] w-auto" />
          <Link to="https://zkm.de/" rel="noopener noreferrer" className="contents">
            <img
              src="/img/zkm.svg"
              alt="Zenrum für Kunst und Medien Karlsruhe"
              className="h-[42px] w-auto"
            />
          </Link>
          <Link to="https://www.themoviedb.org/" rel="noopener noreferrer" className="contents">
            <img src="/img/tmdb.svg" alt="The Movie Database" className="h-[40px] w-auto" />
          </Link>
        </div>
      </Gutter>
    </footer>
  )
}

export default Footer
