import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import Page from "~/components/Page";
import EventsList from "~/components/EventsList";
import { ErrorPage } from "~/components/ErrorPage";
import { mergeMeta, pageTitle } from "~/util/pageMeta";
import type { loader as rootLoader } from "app/root";
import Gutter from "~/components/Gutter";
import Pagination from "~/components/Pagination";
import { useTranslation } from "react-i18next";

export const ErrorBoundary = ErrorPage;

export const loader = async ({
  request,
  context: { payload },
  params: { lang: locale, screeningSeriesSlug },
}: LoaderFunctionArgs) => {
  // compare date for upcoming screenings
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  const screeningSeries = (
    await payload.find({
      collection: "screeningSeries",
      where: {
        slug: {
          equals: screeningSeriesSlug,
        },
      },
      locale,
      depth: 11,
    })
  ).docs[0];

  if (!screeningSeries) {
    throw new Response("Screening series not found", { status: 404 });
  }

  const page = parseInt(new URL(request.url).searchParams.get("page") || "1");
  const depth = 11;
  const [upcoming, past] = await Promise.all([
    payload.find({
      collection: "events",
      where: {
        and: [
          {
            series: {
              equals: screeningSeries.id,
            },
          },
          {
            date: {
              greater_than_equal: today,
            },
          },
          {
            excludeFromUpcoming: {
              not_equals: true,
            },
          },
        ],
      },
      sort: "date",
      locale,
      depth,
      pagination: false,
    }),
    payload.find({
      collection: "events",
      where: {
        and: [
          {
            series: {
              equals: screeningSeries.id,
            },
          },
          {
            date: {
              less_than: today,
            },
          },
        ],
      },
      sort: "-date",
      locale,
      depth,
      pagination: true,
      page,
      limit: 20,
    }),
  ]);

  return {
    screeningSeries,
    upcoming,
    past,
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
      title: pageTitle(
        site?.meta?.title || undefined,
        data?.screeningSeries?.name
      ),
    },
  ];
});

export default function Item() {
  const { t } = useTranslation();
  const { screeningSeries, upcoming, past } = useLoaderData<typeof loader>();
  const { site } = useRouteLoaderData<typeof rootLoader>("root")!;

  return (
    <Page layout={screeningSeries.layout}>
      <div style={{ height: "1em" }} />
      <Gutter>
        {upcoming.docs.length > 0 && (
          <>
            <h2>{t("Upcoming Screenings")}</h2>
            <EventsList
              items={upcoming.docs}
              activeScreeningSery={screeningSeries}
              site={site}
            />
          </>
        )}
        {past.docs.length > 0 && (
          <>
            <h2>{t("Past Screenings")}</h2>
            <EventsList
              items={past.docs}
              activeScreeningSery={screeningSeries}
              site={site}
            />
          </>
        )}
        <Pagination {...past} linkProps={{ prefetch: "intent" }} />
      </Gutter>
    </Page>
  );
}
