import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { Media, Event } from "payload/generated-types";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { Page } from "~/components/Page";
import { EventsList } from "~/components/EventsList";
import { ErrorPage } from "~/components/ErrorPage";
import { HeaderImage } from "~/components/HeaderImage";
import { Heading } from "~/components/Heading";
import { useTranslation } from "react-i18next";
import type { loader as rootLoader } from "app/root";
import { mergeMeta, pageTitle } from "~/util/pageMeta";
import Gutter from "~/components/Gutter";
import type { PaginatedDocs } from "payload/database";
import Pagination from "~/components/Pagination";

export const ErrorBoundary = ErrorPage;

export const loader = async ({
  params,
  request,
  context: { payload },
  params: { lang: locale, season: slug },
}: LoaderFunctionArgs) => {
  const season = (
    await payload.find({
      collection: "seasons",
      where: {
        slug: {
          equals: slug,
        },
      },
      locale,
      depth: 11,
    })
  ).docs[0];

  if (!season) {
    throw new Response("Season not found", { status: 404 });
  }

  const page = parseInt(new URL(request.url).searchParams.get("page") || "1");
  const screenings = (await payload.find({
    collection: "events",
    where: {
      season: {
        equals: season.id,
      },
    },
    locale,
    depth: 11,
    sort: "date",
    pagination: true,
    page,
    limit: 20,
  })) as unknown as PaginatedDocs<Event>;

  const navigation = (
    await payload.find({
      collection: "navigations",
      where: {
        type: {
          equals: "socialMedia",
        },
      },
    })
  ).docs[0];

  return {
    season,
    screenings,
    navigation,
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
      title: pageTitle(site?.meta?.title || undefined, data?.season.name),
    },
    {
      name: "og:image",
      content: (data?.season.header as Media)?.url,
    },
  ];
});

export default function Season() {
  const { t } = useTranslation();
  const { season, screenings, navigation } = useLoaderData<typeof loader>();
  const { site } = useRouteLoaderData<typeof rootLoader>("root")!;

  return (
    <Page layoutType="default">
      <HeaderImage image={season.header as Media} navigation={navigation} />
      <Heading>{season.name}</Heading>
      <Gutter>
        <EventsList
          items={screenings.docs}
          emptyMessage={t("No screenings for this season.")}
          site={site}
        />
        <Pagination {...screenings} linkProps={{ prefetch: "intent" }} />
      </Gutter>
    </Page>
  );
}
