import type { MetaFunction } from "@remix-run/node";
import type { LoaderArgs} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import i18next from "~/i18next.server";
import Movie from "~/components/Movie";
import Image from '~/components/Image';
import classes from "./index.module.css";
import type { Media } from "payload/generated-types";
import { pageTitle } from "~/util/pageMeta";

export const loader = async ({ request, params, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const res = await payload.find({
    collection: 'movies',
    where: {
      slug: {
        equals: params.movieSlug,
      },
    },
    locale,
  });
  if (!res.docs.length) {
    throw new Response('Page not found', { status: 404 })
  }
  return {
    movie: res.docs[0],
  }
};

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => ({
  title: pageTitle(parentsData.root?.site?.meta?.title, data.movie?.title),
  description: data.movie?.synopsis,
});

export default function MovieDetail() {
  const { movie } = useLoaderData<typeof loader>();


  return (
    <>
      <Image image={movie.still as Media} />
      <Movie movie={movie} className={classes.movie} />
    </>
  );
}
