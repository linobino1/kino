import { type LinkProps } from "@remix-run/react";
import environment from "~/util/environment";

export const localizeTo = (
  to: LinkProps["to"],
  lang: string
): LinkProps["to"] => {
  if (typeof to !== "string") return to;

  // let's remove the server URL first, we'll add it back later
  let absolute = false;
  if (to.startsWith(environment().PAYLOAD_PUBLIC_SERVER_URL)) {
    to = to.replace(environment().PAYLOAD_PUBLIC_SERVER_URL, "");
    absolute = true;
  } else if (!to.startsWith("/")) {
    // it is an external link
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

  return absolute ? `${environment().PAYLOAD_PUBLIC_SERVER_URL}${to}` : to;
};
