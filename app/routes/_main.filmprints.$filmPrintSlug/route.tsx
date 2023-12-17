import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { Movie as MovieType } from "payload/generated-types";
import { useLoaderData } from "@remix-run/react";
import i18next from "~/i18next.server";
import { Movie } from "~/components/Movie";
import { Page } from "~/components/Page";
import { ErrorPage } from "~/components/ErrorPage";
import HeaderImage from "~/components/HeaderImage";
import classes from "./index.module.css";
import { mergeMeta, pageTitle } from "~/util/pageMeta";
import type { loader as rootLoader } from "app/root";

export const ErrorBoundary = ErrorPage;

export const loader = async ({
  params,
  request,
  context: { payload },
}: LoaderFunctionArgs) => {
  const data = await payload.find({
    collection: "filmPrints",
    where: {
      slug: {
        equals: params.filmPrintSlug,
      },
    },
    locale: await i18next.getLocale(request),
    depth: 11,
  });
  const navigation = (
    await payload.find({
      collection: "navigations",
      where: {
        type: {
          equals: "socialMedia",
        },
      },
    })
  ).docs[0];

  if (!data.docs.length) {
    throw new Response("Film print not found", { status: 404 });
  }

  return {
    filmPrint: data.docs[0],
    navigation,
  };
};

export const meta: MetaFunction<
  typeof loader,
  {
    root: typeof rootLoader;
  }
> = mergeMeta(({ data, matches }) => {
  const site = matches.find((match) => match?.id === "root")?.data.site;
  return [
    {
      title: pageTitle(site?.meta?.title, data?.filmPrint?.title),
    },
  ];
});

export default function Item() {
  const { filmPrint, navigation } = useLoaderData<typeof loader>();
  const movie = filmPrint.movie as MovieType;

  return (
    <Page className={classes.container}>
      <HeaderImage image={movie.still} navigation={navigation} />
      <main>
        <Movie movie={movie} filmprint={filmPrint} />
      </main>
    </Page>
  );
}
