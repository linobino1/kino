import type {
  HeadersFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { Page } from "~/components/Page";
import { EventsList } from "~/components/EventsList";
import i18next from "~/i18next.server";
import { mergeMeta, pageMeta } from "~/util/pageMeta";
import { ErrorPage } from "~/components/ErrorPage";
import type { loader as rootLoader } from "app/root";
import Gutter from "~/components/Gutter";
import Pagination from "~/components/Pagination";
import { cacheControlShort } from "~/util/cacheControl";

export const ErrorBoundary = ErrorPage;

export const loader = async ({
  request,
  context: { payload },
}: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const page = await payload.findGlobal({
    slug: "screeningsPage",
    locale,
  });

  let today = new Date();
  today.setHours(0, 0, 0, 0);

  const screenings = await payload.find({
    collection: "screenings",
    locale,
    depth: 7,
    limit: 50,
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
  });

  return {
    page,
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

export const headers: HeadersFunction = () => ({
  "Cache-Control": cacheControlShort,
});

export default function Index() {
  const { page, screenings } = useLoaderData<typeof loader>();
  const { site } = useRouteLoaderData<typeof rootLoader>("root")!;

  return (
    <Page layout={page.layout}>
      <Gutter>
        <EventsList items={screenings.docs} site={site} />
        <Pagination {...screenings} linkProps={{ prefetch: "intent" }} />
      </Gutter>
    </Page>
  );
}
