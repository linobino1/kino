import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { Media, Screening } from "payload/generated-types";
import { useLoaderData } from "@remix-run/react";
import i18next from "~/i18next.server";
import { Page } from "~/components/Page";
import { ScreeningsList } from "~/components/ScreeningsList";
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
}: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const season = (
    await payload.find({
      collection: "seasons",
      where: {
        slug: {
          equals: params.season,
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
    collection: "screenings",
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
  })) as unknown as PaginatedDocs<Screening>;

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

  const site = await payload.findGlobal({
    slug: "site",
  });

  return {
    season,
    screenings,
    navigation,
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
      title: pageTitle(site?.meta?.title || undefined, data?.season.name),
    },
    {
      name: "og:image",
      content: (data?.season.header as Media).url,
    },
  ];
});

export default function Season() {
  const { t } = useTranslation();
  const { season, screenings, navigation, site } =
    useLoaderData<typeof loader>();

  return (
    <Page layoutType="default">
      <HeaderImage image={season.header as Media} navigation={navigation} />
      <Heading>{season.name}</Heading>
      <Gutter>
        <ScreeningsList
          items={screenings.docs}
          emptyMessage={t("No screenings for this season.")}
          site={site}
        />
        <Pagination {...screenings} linkProps={{ prefetch: "intent" }} />
      </Gutter>
    </Page>
  );
}
