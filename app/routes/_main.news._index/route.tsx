import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
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
import type { Blog, Post, Screening, Site } from "payload/generated-types";
import type { PaginatedDocs } from "payload/database";
import Gutter from "~/components/Gutter";

let today = new Date();
today.setHours(0, 0, 0, 0);

export const loader = async ({
  request,
  context: { payload },
}: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const site = (await payload.findGlobal({
    slug: "site",
  })) as unknown as Site;
  const page = (await payload.findGlobal({
    slug: "blog",
    locale,
  })) as unknown as Blog;
  const postsPage = parseInt(
    new URL(request.url).searchParams.get("page") || "1"
  );
  const posts = (await payload.find({
    collection: "posts",
    sort: "-date",
    limit: 10,
    pagination: true,
    page: postsPage,
    locale,
  })) as unknown as PaginatedDocs<Post>;
  const screenings = (await payload.find({
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
  })) as unknown as PaginatedDocs<Screening>;

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
  const { site, page, posts, screenings } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <Page layout={page.layout} className={classes.page}>
      <Gutter>
        <section className={classes.upcoming}>
          <h2>{t("Upcoming Screenings")}</h2>
          <ScreeningsList items={screenings.docs} site={site} />
          <p>
            <Link to="/screenings" className={classes.allScreeningsButton}>
              {t("See all screenings")}
            </Link>
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
      </Gutter>
    </Page>
  );
}
