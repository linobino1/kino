import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import classes from "./index.module.css";

export const languages = {
  en: { nativeName: 'English' },
  de: { nativeName: 'Deutsch' }
};

export type Props = {
  className?: string
};

export default function LanguageSwitch({ className }: Props) {
  const { i18n } = useTranslation();

  return (
    <div className={`${classes.container} ${className}`}>
      {(Object.keys(languages) as Array<keyof typeof languages>).map((lng) => {
        const query = new URLSearchParams();
        query.set('lng', lng);

        return (
          <Link
            key={lng}
            className={`${classes.language} ${i18n.language === lng && classes.active}`}
            to={`?${query.toString()}`}
          >
            {lng.toUpperCase()}
          </Link>
        )
      })}
    </div>
  );
}