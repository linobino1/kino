import { redirect, type MetaFunction, type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Page } from "~/components/Page";
import { pageDescription, pageKeywords, pageTitle } from "~/util/pageMeta";
import classes from "./index.module.css";
import i18next from "~/i18next.server";
import Pagination from "~/components/Pagination";
import PostPreview from "~/components/PostPreview";
import { JsonLd } from "cms/structured-data";
import { postsListSchema } from "cms/structured-data/post";
import ScreeningsList from "~/components/ScreeningsList";

let today = new Date();
today.setHours(0, 0, 0, 0);

export const loader = async ({ request, context: { payload } }: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const site = await payload.findGlobal({
    slug: "site",
  });
  const page = await payload.findGlobal({
    slug: "blog",
    locale,
  });
  const postsPage = parseInt(
    new URL(request.url).searchParams.get("page") || "1"
  );
  const posts = await payload.find({
    collection: "posts",
    sort: "-date",
    limit: 10,
    pagination: true,
    page: postsPage,
    locale,
  });
  const screenings = await payload.find({
    collection: "screenings",
    locale,
    depth: 7,
    where: {
      _status: {
        equals: "published",
      },
      and: [
        {
          date: {
            greater_than_equal: today,
          },
        },
      ],
    },
    sort: "date",
    limit: 3,
  });

  // Redirect to the last page if the requested page is greater than the total number of page
  if (postsPage > posts.totalPages) {
    throw redirect(`?page=${posts.totalPages}`, {
      status: 302,
    });
  }

  return {
    site,
    page,
    posts,
    screenings: screenings.docs || [],
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

export default function Index() {
  const { site, page, posts, screenings } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <Page layout={page.layout} className={classes.page}>
      <section className={classes.hero}></section>
      <section className={classes.upcoming}>
        <h2>{t("Upcoming Screenings")}</h2>
        <ScreeningsList items={screenings} site={site} />
        <p>
          <Link to="/screenings">{t("See all screenings")}</Link>
        </p>
      </section>
      <section className={classes.news}>
        <h2>{t("News")}</h2>
        {posts.docs?.length ? (
          <>
            {JsonLd(postsListSchema(posts.docs))}
            <ul className={classes.posts}>
              {posts.docs.map((post) => (
                <li key={post.slug}>
                  <PostPreview post={post} />
                  <hr />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className={classes.empty}>{t("No posts.")}</div>
        )}
        <Pagination {...posts} linkProps={{ prefetch: "intent" }} />
      </section>
    </Page>
  );
}
