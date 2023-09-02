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
    <header className={classes.header}>
      <div className={classes.mainHeader}>
        <Link to="/">
          {site.logo as Media && (
            <Image
              className={classes.mainLogo}
              image={site.logo as Media}
              width={200}
              height={50}
            />
          )}
        </Link>
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <Link
          className={classes.menuButton}
          to={'?modal=menu'}
          aria-label='Menu'
        />
        <Navigation
          navigation={navigations.find((x) => x.type === 'main')}
          className={classes.navMain}
        />
        <UserStatus className={classes.userStatus} />
      </div>
      {content}
      { searchParams.get('modal') === 'menu' && (
        <Modal>
          <div className={classes.mobileMenu}>
            <Navigation
              navigation={navigations.find((x) => x.type === 'main')}
              className={classes.navMobile}
              dataType="mobile"
            />
          </div>
        </Modal>
      )}
    </header>
  )
};

export default Header;
