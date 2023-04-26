import type { LoaderArgs} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page } from "~/components/Page";
import i18next from "~/i18next.server";
import Movie from "~/components/Movie";
import Still from "~/components/Still";
import type { Still as StillType } from "payload/generated-types";

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
    <Page>
      <Still image={movie.still as StillType} />
      <Movie movie={movie} />
    </Page>
  );
}
