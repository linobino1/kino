import React, { useEffect, useState } from "react";
import type {
  Media,
  Site,
  Navigation as NavigationType,
} from "payload/generated-types";
import { Navigation } from "../Navigation";
import { useLocation } from "@remix-run/react";
import { Image } from "~/components/Image";
import { UserStatus } from "../UserStatus";
import classes from "./index.module.css";
import { Hamburger } from "./Hamburger";
import Gutter from "../Gutter";
import { useTranslation } from "react-i18next";
import { Link } from "~/components/localized-link";

type Props = {
  site: Site;
  navigations: NavigationType[];
};

const Header: React.FC<Props> = ({ site, navigations }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const toggleMenu = () => setMenuIsOpen((prev) => !prev);

  const { pathname } = useLocation();

  // close menu on navigation
  const { i18n } = useTranslation();
  useEffect(() => {
    setMenuIsOpen(false);
  }, [pathname, i18n.language]);

  // lock body scroll when menu is open
  useEffect(() => {
    if (menuIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuIsOpen]);

  return (
    <>
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
              onClick={toggleMenu}
              className={classes.menuButton}
              aria-label="Menu"
            >
              <Hamburger collapsed={menuIsOpen} />
            </button>
            <Navigation
              navigation={navigations.find((x) => x.type === "main")}
              className={classes.navMain}
            />
            <UserStatus className={classes.userStatus} />
          </div>
        </Gutter>
      </header>
      <div className={classes.mobileMenu} aria-hidden={!menuIsOpen}>
        <UserStatus />
        <Navigation
          navigation={navigations.find((x) => x.type === "main")}
          className={classes.navMobile}
          dataType="mobile"
        />
      </div>
    </>
  );
};

export default Header;
