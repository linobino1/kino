import type { LoaderArgs} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page } from "~/components/Page";
import { FilmPrintsList } from "~/components/FilmPrintsList";
import classes from "./index.module.css";
import i18next from "~/i18next.server";

export const loader = async ({ request, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const page = await payload.findGlobal({
    slug: 'screeningsPage',
    locale,
  });
  const filmPrints = await payload.find({
    collection: 'filmPrints',
    locale,
    depth: 7,
    where: {
      _status: {
        equals: 'published',
      },
    },
  });
  
  return {
    page,
    screenings: filmPrints.docs || [],
  }
};

export default function Index() {
  const { page, screenings } = useLoaderData<typeof loader>();


  return (
    <Page layout={page.layout}>
      <div className={classes.postsWrapper}>
        <FilmPrintsList items={screenings} className={classes.screeningsList} />
      </div>
    </Page>
  );
}
