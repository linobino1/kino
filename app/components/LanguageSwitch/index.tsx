import { Link, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import classes from "./index.module.css";
import { getLocalizedPathnames } from "~/util/getHreflangLinks";

export const languages = {
  en: { nativeName: "English" },
  de: { nativeName: "Deutsch" },
};

export type Props = {
  className?: string;
};

export default function LanguageSwitch({ className }: Props) {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const pathnames = getLocalizedPathnames(pathname);

  return (
    <div className={className}>
      {Object.keys(pathnames).map(
        (lang) =>
          lang !== "none" && (
            <Link
              key={lang}
              className={`${classes.language} ${
                i18n.language === lang && classes.active
              }`}
              to={pathnames[lang] as string}
              rel="alternate"
              hrefLang={lang}
              onClick={() => i18n.changeLanguage(lang)}
              preventScrollReset
              reloadDocument
            >
              {lang.toUpperCase()}
            </Link>
          )
      )}
    </div>
  );
}
