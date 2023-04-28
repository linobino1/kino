import type { LoaderArgs} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page } from "~/components/Page";
import classes from "./index.module.css";
import { ScreeningsList } from "~/components/ScreeningsList";
import i18next from "~/i18next.server";

export const loader = async ({ request, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const page = await payload.findGlobal({
    slug: 'screeningsPage',
    locale,
  });
  const screenings = await payload.find({
    collection: 'screenings',
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
    screenings: screenings.docs || [],
  }
};

export default function Index() {
  const { page, screenings } = useLoaderData<typeof loader>();


  return (
    <Page layout={page.layout}>
      <div className={classes.postsWrapper}>
        <ScreeningsList items={screenings} className={classes.screeningsList} />
      </div>
    </Page>
  );
}
