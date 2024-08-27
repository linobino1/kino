import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { localizeTo } from "~/components/localized-link/util/localizeTo";
import i18next from "~/i18next.server";

/**
 * Redirect to /news
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // find out preferred language from the request headers
  const lang = await i18next.getLocale(request);
  const to = localizeTo("/news", lang) as string;
  throw redirect(to);
};
