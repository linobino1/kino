import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page } from "~/components/Page";
import { ScreeningsList } from "~/components/ScreeningsList";
import i18next from "~/i18next.server";
import { mergeMeta, pageMeta } from "~/util/pageMeta";
import { ErrorPage } from "~/components/ErrorPage";
import type { loader as rootLoader } from "app/root";
import Gutter from "~/components/Gutter";

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
  });

  const site = await payload.findGlobal({
    slug: "site",
  });

  return {
    page,
    screenings: screenings.docs || [],
    site,
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
  const { page, screenings, site } = useLoaderData<typeof loader>();

  return (
    <Page layout={page.layout}>
      <Gutter>
        <ScreeningsList items={screenings} site={site} />
      </Gutter>
    </Page>
  );
}
