import type { Language } from "~/i18n";
import { returnLanguageIfSupported } from "~/i18n";
import environment from "./environment";
import type { Path } from "@remix-run/react";

const absoluteUrl = (location: Path) => {
  return (
    new URL(location.pathname, environment().PAYLOAD_PUBLIC_SERVER_URL).href +
    location.search +
    location.hash
  );
};

export const getLocalizedPathnames = (
  pathname: string
): Record<Language, string> => {
  const urlLanguage = returnLanguageIfSupported(pathname.split("/")[1]);
  const pathnames: Record<Language, string> = {};

  switch (urlLanguage) {
    case "en":
      pathnames.en = pathname;
      pathnames.de = pathname.replace("/en/", "/de/");
      pathnames.none = pathname.replace("/en/", "/");
      break;
    case "de":
      pathnames.en = pathname.replace("/de/", "/en/");
      pathnames.de = pathname;
      pathnames.none = pathname.replace("/de/", "/");
      break;
    case undefined:
      pathnames.en = "/en" + pathname;
      pathnames.de = "/de" + pathname;
      pathnames.none = pathname;
      break;
  }
  return pathnames;
};

export const getHreflangLinks = (location: Path) => {
  const pathnames = getLocalizedPathnames(location.pathname);
  return Object.keys(pathnames).map((lang) => ({
    tagName: "link",
    rel: "alternate",
    href: absoluteUrl({ ...location, pathname: pathnames[lang] as string }),
    hrefLang: lang === "none" ? "x-default" : lang,
  }));
};

/**
 * get the canonical link for the current page. We'll use the language-agnostic URL
 */
export const getCannonicalLink = (location: Path) => {
  const pathnames = getLocalizedPathnames(location.pathname);
  return {
    tagName: "link",
    rel: "canonical",
    href: absoluteUrl({
      ...location,
      pathname: pathnames["none"] as string,
    }),
  };
};
