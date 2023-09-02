import React from 'react';
import { Navigation } from '../Navigation';
import RichText from '../RichText';
import type { Navigation as NavigationType, Site } from 'payload/generated-types';
import classes from './index.module.css';
import NewsletterSignup from '../newsletter-signup';

export type Props = {
  site: Site
  navigations: NavigationType[]
}

export const Footer: React.FC<Props> = ({
  site, navigations,
}) => {
  return (
    <footer className={classes.footer}>
      <RichText content={site.footerContent} className={classes.address} />
      <Navigation
        navigation={navigations.find((x) => x.type === 'footer')}
        className={classes.navFooter}
      />
      <Navigation
        navigation={navigations.find((x) => x.type === 'socialMedia')}
        className={classes.navSocial}
      />
      <NewsletterSignup className={classes.newsletter} />
    </footer>
  )
};

export default Footer;
