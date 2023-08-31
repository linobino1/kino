import React from 'react';
import type {
  StaticPage,
  Media,
  Navigation as NavigationType,
} from "payload/generated-types";
import { Link } from '@remix-run/react';
import { Image } from '~/components/Image';
import classes from './index.module.css';
import LanguageSwitch from '../LanguageSwitch';

type Props = {
  navigation?: NavigationType
  className?: string
  dataType?: string
};

export const Navigation: React.FC<Props> = ({
  navigation, className, dataType,
}) => {
  // each item renders as either an internal link, an external link with an icon or text, or another navigation
  return navigation ? (
    <nav
      className={`${classes.nav} ${className}`}
      data-type={dataType || navigation.type}
    >
      {navigation?.items?.map((item) => {
        if (item.type === 'language') {
          return <LanguageSwitch key={item.id} className={classes.navItem} />;
        }

        const href = item.relPath || (item.page as StaticPage ? `/${(item.page as StaticPage).slug}` : item.url);

        // const isActive = (
          // asPath === `/${(page as StaticPage)?.slug}`
        // );
        const isActive = false;

        // image or plain text
        const inner: React.ReactNode = item.icon ? (
          <Image
            image={item.icon as Media}
            className={classes.image}
          />
        ) : (
          <span>{item.name}</span>
        );

        // subnavigation or link
        return (
          <div key={item.id} style={{display: 'contents'}}>
            { item.type === 'subnavigation' ? (
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
              <Link
                to={href}
                className={`${classes.navItem} ${isActive && classes.active}`}
                target={item.newTab ? '_blank' : undefined}
                prefetch='intent'
              >
                {inner}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  ) : (<></>);
};

export default Navigation;
