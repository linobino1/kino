import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import i18next from "~/i18next.server";
import Page from "~/components/Page";
import ScreeningsList from "~/components/ScreeningsList";
import { ErrorPage } from "~/components/ErrorPage";
import { mergeMeta, pageTitle } from "~/util/pageMeta";
import type { loader as rootLoader } from "app/root";

export const ErrorBoundary = ErrorPage;

export const loader = async ({
  params,
  request,
  context: { payload },
}: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const screeningSeries = (
    await payload.find({
      collection: "screeningSeries",
      where: {
        slug: {
          equals: params.screeningSeriesSlug,
        },
      },
      locale,
      depth: 11,
    })
  ).docs[0];

  if (!screeningSeries) {
    throw new Response("Screening series not found", { status: 404 });
  }

  const screenings = (
    await payload.find({
      collection: "screenings",
      where: {
        series: {
          equals: screeningSeries.id,
        },
      },
      locale,
      depth: 11,
      sort: "date",
    })
  ).docs;

  const site = await payload.findGlobal({
    slug: "site",
  });

  return {
    screeningSeries,
    screenings,
    site,
  };
};

export const meta: MetaFunction<
  typeof loader,
  {
    root: typeof rootLoader;
  }
> = mergeMeta(({ data, matches }) => {
  const site = matches.find((match) => match?.id === "root")?.data.site;

  return [
    {
      title: pageTitle(site?.meta?.title, data?.screeningSeries?.name),
    },
  ];
});

export default function Item() {
  const { screeningSeries, screenings, site } = useLoaderData<typeof loader>();

  return (
    <Page layout={screeningSeries.layout}>
      <ScreeningsList
        items={screenings}
        activeScreeningSery={screeningSeries}
        site={site}
      />
    </Page>
  );
}
