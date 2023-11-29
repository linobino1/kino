import React from "react";
import { Navigation } from "../Navigation";
import RichText from "../RichText";
import type {
  Navigation as NavigationType,
  Site,
} from "payload/generated-types";
import classes from "./index.module.css";
import NewsletterSignup from "../newsletter-signup";

export type Props = {
  site: Site;
  navigations: NavigationType[];
};

export const Footer: React.FC<Props> = ({ site, navigations }) => {
  return (
    <footer className={classes.footer}>
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
          <img
            src="/img/hfg.svg"
            alt="Hochschule für Gestaltung Karlsruhe"
            height={60}
          />
          <img src="/img/asta.svg" alt="AstA HfG Karlsruhe" height={40} />
          <img
            src="/img/zkm.svg"
            alt="Zenrum für Kunst und Medien Karlsruhe"
            className={classes.logo}
            height={25}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
