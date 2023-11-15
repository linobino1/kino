import { redirect, type LoaderArgs, type MetaFunction } from "@remix-run/node";
import type { Media } from "payload/generated-types";
import { useLoaderData } from "@remix-run/react";
import i18next from "~/i18next.server";
import { Page } from "~/components/Page";
import { pageDescription, pageKeywords, pageTitle } from "~/util/pageMeta";
import { ErrorPage } from "~/components/ErrorPage";
import classes from "./index.module.css";
import Image from "~/components/Image";
import Pagination from "~/components/Pagination";

export const ErrorBoundary = ErrorPage;

export const loader = async ({ request, context: { payload } }: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const page = await payload.findGlobal({
    slug: "seasonsPage",
    locale,
  });
  const pageNumber = parseInt(
    new URL(request.url).searchParams.get("page") || "1"
  );
  const seasons = await payload.find({
    collection: "seasons",
    locale,
    depth: 3,
    limit: 10,
    pagination: true,
    sort: "-sort",
    page: pageNumber,
  });

  // Redirect to the last page if the requested page is greater than the total number of page
  if (pageNumber > seasons.totalPages) {
    throw redirect(`?page=${seasons.totalPages}`, {
      status: 302,
    });
  }
  return {
    page,
    seasons,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => ({
  title: pageTitle(
    parentsData.root?.site?.meta?.title,
    data?.page?.meta?.title
  ),
  description: pageDescription(
    parentsData.root?.site?.meta?.description,
    data?.page?.meta?.description
  ),
  keywords: pageKeywords(
    parentsData.root?.site?.meta?.keywords,
    data?.page?.meta?.keywords
  ),
});

export default function Seasons() {
  const { page, seasons } = useLoaderData<typeof loader>();

  return (
    <Page layout={page.layout}>
      <main>
        {seasons.docs?.length ? (
          <ul className={classes.seasons}>
            {seasons.docs.map((season) => (
              <li key={season.id}>
                <a href={`/seasons/${season.slug}`}>
                  <Image image={season.header as Media} alt={season.name} />
                  <div className={classes.overlay}>
                    <h2>{season.name}</h2>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <Pagination {...seasons} linkProps={{ prefetch: "intent" }} />
      </main>
    </Page>
  );
}
