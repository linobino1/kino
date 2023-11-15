import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import i18next from "~/i18next.server";
import classes from "./__main.module.css";
import { ErrorPage } from "~/components/ErrorPage";

export const ErrorBoundary = ErrorPage;

export const loader = async ({ request, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);

  const [site, navigations] = await Promise.all([
    payload.findGlobal({
      slug: 'site',
    }),
    payload.find({
      collection: 'navigations',
      depth: 12,
      locale,
    }),
  ]);
  return {
    site,
    navigations: navigations.docs,
  };
}

export const handle = {
  i18n: ['common']
};

export default function Layout() {
  const { site, navigations } = useLoaderData<typeof loader>();

  return (
    <>
      <div className={classes.aboveFooter}>
        <Header
          site={site}
          navigations={navigations}
        />
        <Outlet />
      </div>
      <Footer
        site={site}
        navigations={navigations}
      />
    </>
  );
}