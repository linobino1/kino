import type { MetaFunction } from "@remix-run/node";
import type { LoaderArgs} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page } from "~/components/Page";
import classes from "./index.module.css";
import { ScreeningsList } from "~/components/ScreeningsList";
import i18next from "~/i18next.server";
import { pageDescription, pageKeywords, pageTitle } from "~/util/pageMeta";

export const loader = async ({ request, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const page = await payload.findGlobal({
    slug: 'screeningsPage',
    locale,
  });
  const group = (await payload.find({
    collection: 'screeningGroups',
    locale,
    where: {
      default: {
        equals: true,
      },
    },
  })).docs[0];
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
          'group': {
            equals: group.id,
          },
        },
      ],
    },
    sort: 'date',
  });
  
  return {
    page,
    screenings: screenings.docs || [],
  }
};

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => ({
  title: pageTitle(parentsData.root?.site?.meta?.title, data.page?.meta?.title),
  description: pageDescription(parentsData.root?.site?.meta?.description, data.page?.meta?.description),
  keywords: pageKeywords(parentsData.root?.site?.meta?.keywords, data.page?.meta?.keywords),
});

export default function Index() {
  const { page, screenings } = useLoaderData<typeof loader>();


  return (
    <Page layout={page.layout}>
      <ScreeningsList items={screenings} className={classes.screeningsList} />
    </Page>
  );
}
