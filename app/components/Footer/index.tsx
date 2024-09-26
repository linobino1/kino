import React from "react";
import { Navigation } from "../Navigation";
import RichText from "../RichText";
import type {
  Navigation as NavigationType,
  Site,
} from "payload/generated-types";
import classes from "./index.module.css";
import NewsletterSignup from "../newsletter-signup";
import Gutter from "../Gutter";
import { Link } from "@remix-run/react";

export type Props = {
  site: Site;
  navigations: NavigationType[];
};

export const Footer: React.FC<Props> = ({ site, navigations }) => {
  return (
    <footer className={classes.footer}>
      <Gutter size="large">
        <div className={classes.content}>
          <RichText content={site.footerContent} className={classes.address} />
          <Navigation
            navigation={navigations.find((x) => x.type === "footer")}
            className={classes.navFooter}
          />
          <Navigation
            navigation={navigations.find((x) => x.type === "socialMedia")}
            className={classes.navSocial}
          />
          <NewsletterSignup className={classes.newsletter} />
          <div className={classes.logos}>
            <Link to="https://hfg-karlsruhe.de/" rel="noopener noreferrer">
              <img
                src="/img/hfg.svg"
                alt="Hochschule für Gestaltung Karlsruhe"
                height={60}
              />
            </Link>
            <img src="/img/asta.svg" alt="AstA HfG Karlsruhe" height={40} />
            <Link to="https://zkm.de/" rel="noopener noreferrer">
              <img
                src="/img/zkm.svg"
                alt="Zenrum für Kunst und Medien Karlsruhe"
                className={classes.logo}
                height={42}
              />
            </Link>
            <Link to="https://www.themoviedb.org/" rel="noopener noreferrer">
              <img src="/img/tmdb.svg" alt="The Movie Database" height={40} />
            </Link>
          </div>
        </div>
      </Gutter>
    </footer>
  );
};

export default Footer;
