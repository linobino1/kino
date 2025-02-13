import { type LinkProps } from "react-router";

export const localizeTo = (
  to: LinkProps["to"],
  lang: string,
): LinkProps["to"] => {
  if (typeof to !== "string") return to;

  // don't localize external links
  if (!to.startsWith("/")) {
    return to;
  }

  if (to === "/") {
    to = `/${lang}`;
  } else {
    // strip the language from the path if it is there
    to = to.replace(/^\/(en|de)\//, "/");

    // add the new language to the path
    to = `/${lang}${to}`;
  }

  return to;
};
