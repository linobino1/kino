/* eslint-disable no-case-declarations */
import React from "react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import i18next from "~/i18next.server";
import { Response } from "@remix-run/node";
import Page from "~/components/Page";
import { mergeMeta, pageMeta } from "~/util/pageMeta";
import { ErrorPage } from "~/components/ErrorPage";
import type { loader as rootLoader } from "app/root";

export const ErrorBoundary = ErrorPage;

export const loader = async ({
  request,
  params,
  context: { payload },
}: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const res = await payload.find({
    collection: "staticPages",
    where: {
      slug: {
        equals: params?.staticPage,
      },
    },
    locale,
  });
  if (!res.docs.length) {
    throw new Response("Page not found", { status: 404 });
  }
  return {
    page: res.docs[0],
  };
};

export const meta: MetaFunction<
  typeof loader,
  {
    root: typeof rootLoader;
  }
> = mergeMeta(({ data, matches }) => {
  const site = matches.find((match) => match?.id === "root")?.data.site;
  return pageMeta(data?.page.meta, site?.meta);
});

export const StaticPage: React.FC = () => {
  const { page } = useLoaderData<typeof loader>();

  return <Page layout={page.layout} />;
};

export default StaticPage;
