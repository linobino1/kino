import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import i18next from "~/i18next.server";
import classes from "./index.module.css";
import { ErrorPage } from "~/components/ErrorPage";
import type { loader as rootLoader } from "~/root";

export const ErrorBoundary = ErrorPage;

export const loader = async ({
  request,
  context: { payload },
}: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);

  const navigations = await payload.find({
    collection: "navigations",
    depth: 12,
    locale,
  });

  return {
    navigations: navigations.docs,
  };
};

export const handle = {
  i18n: ["common"],
};

export default function Layout() {
  const { navigations } = useLoaderData<typeof loader>();
  const { site } = useRouteLoaderData<typeof rootLoader>("root")!;

  return (
    <>
      <div className={classes.aboveFooter}>
        <Header site={site} navigations={navigations} />
        <Outlet />
      </div>
      <Footer site={site} navigations={navigations} />
    </>
  );
}
