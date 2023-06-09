import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import classes from "./index.module.css";
import i18next from "~/i18next.server";
import Page from "~/components/Page";
import ScreeningsList from "~/components/ScreeningsList";

export const loader = async ({ params, request, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const screeningSeries = (await payload.find({
    collection: 'screeningSeries',
    where: {
      slug: {
        equals: params.screeningSeriesSlug,
      },
    },
    locale,
    depth: 11,
  })).docs[0];
  const screenings = (await payload.find({
    collection: 'screenings',
    where: {
      series: {
        equals: screeningSeries.id,
      },
    },
    locale,
    depth: 11,
  })
  ).docs;
  
  
  return {
    screeningSeries,
    screenings,
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: data.screeningSeries.name,
  }
};

export default function Item() {
  const { screeningSeries, screenings } = useLoaderData<typeof loader>();

  return (
    <Page layout={screeningSeries.layout}>
      <ScreeningsList items={screenings} className={classes.screeningsList} />
    </Page>
  )
}