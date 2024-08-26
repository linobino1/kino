import type { HeadersFunction } from "@remix-run/node";

export const routeHeaders: HeadersFunction = ({
  loaderHeaders,
  parentHeaders,
}) => {
  let res = new Headers();

  if (loaderHeaders.get("Cache-Control")) {
    res.set("Cache-Control", loaderHeaders.get("Cache-Control") as string);
  }
  if (parentHeaders.get("Content-Language")) {
    res.set(
      "Content-Language",
      parentHeaders.get("Content-Language") as string
    );
  }

  return res;
};
