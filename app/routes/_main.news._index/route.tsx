import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
  type HeadersFunction,
} from "@remix-run/node";
import { Link, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Page } from "~/components/Page";
import { mergeMeta, pageMeta } from "~/util/pageMeta";
import classes from "./index.module.css";
import i18next from "~/i18next.server";
import Pagination from "~/components/Pagination";
import PostPreview from "~/components/PostPreview";
import { JsonLd } from "cms/structured-data";
import { postsListSchema } from "cms/structured-data/post";
import ScreeningsList from "~/components/ScreeningsList";
import type { loader as rootLoader } from "app/root";
import Gutter from "~/components/Gutter";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=3600, s-maxage=3600",
});

export const loader = async ({
  request,
  context: { payload },
}: LoaderFunctionArgs) => {
  // compare date for upcoming screenings
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  // pagination for posts
  const postsPage = parseInt(
    new URL(request.url).searchParams.get("page") || "1"
  );

  const locale = await i18next.getLocale(request);
  const [page, posts, screenings] = await Promise.all([
    payload.findGlobal({
      slug: "blog",
      locale,
    }),
    payload.find({
      collection: "posts",
      sort: "-date",
      limit: 10,
      pagination: true,
      page: postsPage,
      locale,
    }),
    payload.find({
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
          {
            excludeFromUpcoming: {
              not_equals: true,
            },
          },
        ],
      },
      sort: "date",
      limit: 3,
    }),
  ]);

  // Redirect to the last page if the requested page is greater than the total number of page
  if (postsPage > posts.totalPages) {
    throw redirect(`?page=${posts.totalPages}`, {
      status: 302,
    });
  }

  return {
    page,
    posts,
    screenings,
  };
};

export const meta: MetaFunction<
  typeof loader,
  {
    root: typeof rootLoader;
  }
> = mergeMeta(({ data, matches }) => {
  const site = matches.find((match) => match?.id === "root")?.data.site;
  return pageMeta(data?.page.meta, site?.meta);
});

export default function Index() {
  const { page, posts, screenings } = useLoaderData<typeof loader>();
  const { site } = useRouteLoaderData<typeof rootLoader>("root")!;
  const { t } = useTranslation();

  return (
    <Page layout={page.layout} className={classes.page}>
      <Gutter>
        <section className={classes.upcoming}>
          <h2>{t("Upcoming Screenings")}</h2>
          <ScreeningsList items={screenings.docs} site={site} />
          <Link to="/screenings" className={classes.allScreeningsButton}>
            {t("See all screenings")}
          </Link>
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
      </Gutter>
    </Page>
  );
}
