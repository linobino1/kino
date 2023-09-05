import type { MetaFunction } from "@remix-run/node";
import type { LoaderArgs} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page } from "~/components/Page";
import { ScreeningsList } from "~/components/ScreeningsList";
import i18next from "~/i18next.server";
import { pageTitle } from "~/util/pageMeta";
import { Response } from '@remix-run/node';
import { ErrorPage } from "~/components/ErrorPage";

export const ErrorBoundary = ErrorPage;

export const loader = async ({ request, params, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const season = (await payload.find({
    collection: 'screeningSeasons',
    locale,
    where: {
      slug: {
        equals: params.seasonSlug,
      },
    },
  })).docs[0];
  if (!season) {
    throw new Response('Page not found', { status: 404 });
  }
  const screenings = await payload.find({
    collection: 'screenings',
    locale,
    depth: 7,
    where: {
      _status: {
        equals: 'published',
      },
      and: [
        {
          season: {
            equals: season.id,
          },
        },
      ],
    },
    sort: 'date',
  });
  
  return {
    season,
    screenings: screenings.docs || [],
  }
};

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => ({
    title: pageTitle(parentsData.root?.site?.meta?.title, data?.season.name),
});

export default function Index() {
  const { season, screenings } = useLoaderData<typeof loader>();

  return (
    <Page>
      <h1>{season.name}</h1>
      <ScreeningsList items={screenings} />
    </Page>
  );
}