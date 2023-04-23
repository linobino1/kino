import React from 'react';
import { Navigation } from '../Navigation';
import RichText from '../RichText';
import type { Navigation as NavigationType, Site } from 'payload/generated-types';
import classes from './index.module.css';
import Button from '../Button';
import { useTranslation } from 'react-i18next';

export type Props = {
  site: Site
  navigations: NavigationType[]
}

export const Footer: React.FC<Props> = ({
  site, navigations,
}) => {
  const { t } = useTranslation();
  return (
    <footer className={classes.footer}>
      <Navigation
        navigation={navigations.find((x) => x.type === 'footer')}
        className={classes.navFooter}
      />
      <div className={classes.copyright}>{`© ${(new Date().getFullYear())}`}</div>
      <Navigation
        navigation={navigations.find((x) => x.type === 'socialMedia')}
        className={classes.navSocial}
      />
      <RichText content={site.footerContent} className={classes.footerContent} />
      <div className={classes.buttons}>
        <Button
          layout="big"
          color="white"
        >{t('Hit me')}</Button>
      </div>
    </footer>
  )
};

export default Footer;
