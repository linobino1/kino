import React from "react";
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Page from "~/components/Page";
import { mergeMeta, pageMeta } from "~/util/pageMeta";
import { ErrorPage } from "~/components/ErrorPage";
import type { loader as rootLoader } from "app/root";
import { cacheControlShortWithSWR } from "~/util/cache-control/cacheControlShortWithSWR";
import { routeHeaders } from "~/util/cache-control/routeHeaders";

export const ErrorBoundary = ErrorPage;

export const loader = async ({
  context: { payload },
  params: { lang: locale, staticPage: slug },
}: LoaderFunctionArgs) => {
  // if path is sth. like /en, this route will match, but locale will be undefined and the locale will be in the staticPage param
  if (!locale && slug) {
    throw redirect(`/`);
  }

  const res = await payload.find({
    collection: "staticPages",
    where: {
      slug: {
        equals: slug,
      },
    },
    locale,
  });

  if (!res.docs.length) {
    throw new Response("Page not found", { status: 404 });
  }

  return json(
    {
      page: res.docs[0],
    },
    {
      headers: {
        "Cache-Control": cacheControlShortWithSWR,
      },
    }
  );
};

export const headers = routeHeaders;

export const meta: MetaFunction<
  typeof loader,
  {
    root: typeof rootLoader;
  }
> = mergeMeta(({ data, matches }) => {
  const site = matches.find((match) => match?.id === "root")?.data.site;
  return pageMeta(data?.page?.meta, site?.meta);
});

export const StaticPage: React.FC = () => {
  const { page } = useLoaderData<typeof loader>();

  return <Page layout={page?.layout} />;
};

export default StaticPage;
