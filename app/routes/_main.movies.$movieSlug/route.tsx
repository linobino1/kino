import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import i18next from "~/i18next.server";
import Image from "~/components/Image";
import MovieInfo from "~/components/MovieInfo";
import type { Media } from "payload/generated-types";
import { mergeMeta, pageDescription, pageTitle } from "~/util/pageMeta";
import { ErrorPage } from "~/components/ErrorPage";
import type { loader as rootLoader } from "app/root";

export const ErrorBoundary = ErrorPage;

export const loader = async ({
  request,
  params,
  context: { payload },
}: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const res = await payload.find({
    collection: "movies",
    where: {
      slug: {
        equals: params.movieSlug,
      },
    },
    locale,
  });

  if (!res.docs.length) {
    throw new Response("Movie not found", { status: 404 });
  }

  return {
    movie: res.docs[0],
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
      title: pageTitle(site?.meta?.title, data?.movie.title),
    },
    {
      name: "description",
      content: pageDescription(site?.meta?.description, data?.movie.synopsis),
    },
    {
      name: "og:image",
      content: (data?.movie.still as Media)?.url,
    },
  ];
});

export default function MovieDetail() {
  const { movie } = useLoaderData<typeof loader>();

  return (
    <>
      <Image image={movie.still as Media} />
      <MovieInfo movie={movie} />
    </>
  );
}
