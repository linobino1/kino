import { Language, returnLanguageIfSupported } from "~/i18n";
import environment from "./environment";

const absoluteUrl = (pathname: string) => {
  return `${environment().PAYLOAD_PUBLIC_SERVER_URL}${pathname}`;
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

export const getHreflangLinks = (pathname: string) => {
  const pathnames = getLocalizedPathnames(pathname);
  return Object.keys(pathnames).map((lang) => ({
    tagName: "link",
    rel: "alternate",
    href: absoluteUrl(pathnames[lang] as string),
    hrefLang: lang === "none" ? "x-default" : lang,
  }));
};
