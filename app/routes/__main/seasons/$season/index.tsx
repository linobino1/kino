import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import type { Media } from "payload/generated-types";
import { useLoaderData } from "@remix-run/react";
import i18next from "~/i18next.server";
import { Page } from "~/components/Page";
import { ScreeningsList } from "~/components/ScreeningsList";
import { ErrorPage } from "~/components/ErrorPage";
import { HeaderImage } from "~/components/HeaderImage";
import { Heading } from "~/components/Heading";
import { useTranslation } from "react-i18next";

export const ErrorBoundary = ErrorPage;

export const loader = async ({ params, request, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const season = (await payload.find({
    collection: 'seasons',
    where: {
      slug: {
        equals: params.season,
      },
    },
    locale,
    depth: 11,
  })).docs[0];
  
  if (!season) {
    throw new Response('Season not found', { status: 404 });
  }
  
  const screenings = (await payload.find({
    collection: 'screenings',
    where: {
      season: {
        equals: season.id,
      },
    },
    locale,
    depth: 11,
    sort: 'date',
  })
  ).docs;
  
  return {
    season,
    screenings,
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: data.season.name,
  }
};

export default function Season() {
  const { t } = useTranslation();
  const { season, screenings } = useLoaderData<typeof loader>();

  return (
    <Page layoutType='default'>
      <HeaderImage
        image={season.header as Media}
      />
      <Heading>{season.name}</Heading>
      <ScreeningsList
        items={screenings}
        emptyMessage={t('No screenings for this season.')}
      />
    </Page>
  )
}