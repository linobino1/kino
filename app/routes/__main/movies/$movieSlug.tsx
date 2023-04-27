import type { MetaFunction } from "@remix-run/node";
import type { LoaderArgs} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import i18next from "~/i18next.server";
import Movie from "~/components/Movie";
import Still from "~/components/Still";
import type { Still as StillType } from "payload/generated-types";
import classes from "./index.module.css";

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: data.movie.title,
})

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

export default function MovieDetail() {
  const { movie } = useLoaderData<typeof loader>();


  return (
    <>
      <Still image={movie.still as StillType} />
      <Movie movie={movie} className={classes.movie} />
    </>
  );
}
