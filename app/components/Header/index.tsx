/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import type { Media } from "payload/generated-types";
import { Navigation } from '../Navigation';
import { Link, useNavigate, useSearchParams } from '@remix-run/react';
import { Image } from '~/components/Image';
import type { Site, Navigation as NavigationType } from 'payload/generated-types';
import classes from './index.module.css';
import Button from '../Button';
import Modal from '../Modal';
import LanguageSwitch from '../LanguageSwitch';
import { UserStatus } from '../UserStatus';

type Props = {
  site: Site
  navigations: NavigationType[]
  content?: React.ReactNode
};

const Header: React.FC<Props> = ({
  site, navigations, content,
}) => {
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();
  
  return (
    <header>
      <div className={classes.mainHeader}>
        <div className={`${classes.navMainContainer}`}>
          <div className={classes.menuBody}>
            <Navigation
              navigation={navigations.find((x) => x.type === 'main')}
              className={classes.navMain}
            />
          </div>
        </div>
        <Link to="/" className={classes.logoContainer}>
          {site.logo as Media && (
            <Image
              className={classes.logo}
              image={site.logo as Media}
              width={350}
              height={125}
            />
          )}
        </Link>
        <Button
          layout="symbol"
          symbol="menu"
          className={classes.menuButton}
          onClick={() => navigate('?modal=menu', { preventScrollReset: true })}
        />
        <div className={classes.navSecondary}>
          <LanguageSwitch />
          <UserStatus />
        </div>
      </div>
      {content}
      { searchParams.get('modal') === 'menu' && (
        <Modal>
          <div className={classes.mobileMenu}>
            <Navigation
              navigation={navigations.find((x) => x.type === 'mobile')}
              className={classes.navMobile}
            />
          </div>
        </Modal>
      )}
    </header>
  );
};

export default Header;
