import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import i18next from "~/i18next.server";

/**
 * Redirect to /news
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const lang = await i18next.getLocale(request);
  throw redirect(`/${lang}/news`);
};

export default function Index() {
  return <></>;
}
