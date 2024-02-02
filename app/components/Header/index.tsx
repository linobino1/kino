/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from "react";
import type {
  Media,
  Site,
  Navigation as NavigationType,
} from "payload/generated-types";
import { Navigation } from "../Navigation";
import { Link, useLocation } from "@remix-run/react";
import { Image } from "~/components/Image";
import { UserStatus } from "../UserStatus";
import classes from "./index.module.css";
import { Modal, useModal } from "@faceless-ui/modal";
import { Hamburger } from "./Hamburger";
import Gutter from "../Gutter";

type Props = {
  site: Site;
  navigations: NavigationType[];
};

const Header: React.FC<Props> = ({ site, navigations }) => {
  const { toggleModal, isModalOpen, closeModal } = useModal();

  const location = useLocation();

  useEffect(() => {
    closeModal("menu");
  }, [location, closeModal]);

  return (
    <header className={classes.headerWrapper}>
      <Gutter size="large">
        <div className={classes.header}>
          <Link to="/">
            {(site.logo as Media) && (
              <Image
                className={classes.logo}
                image={site.logo as Media}
                width={200}
                height={50}
              />
            )}
            {(site.logoMobile as Media) && (
              <Image
                className={classes.logoMobile}
                image={site.logoMobile as Media}
                width={200}
                height={50}
              />
            )}
          </Link>
          <button
            onClick={() => toggleModal("menu")}
            className={classes.menuButton}
            aria-label="Menu"
          >
            <Hamburger collapsed={isModalOpen("menu")} />
          </button>
          <Navigation
            navigation={navigations.find((x) => x.type === "main")}
            className={classes.navMain}
          />
          <UserStatus className={classes.userStatus} />
          <Modal slug="menu" className={classes.mobileMenu}>
            <UserStatus />
            <Navigation
              navigation={navigations.find((x) => x.type === "main")}
              className={classes.navMobile}
              dataType="mobile"
            />
          </Modal>
        </div>
      </Gutter>
    </header>
  );
};

export default Header;
