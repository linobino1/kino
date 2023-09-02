import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type {
  Movie as MovieType,
  Media,
} from "payload/generated-types";
import { Movie } from "~/components/Movie";
import classes from "./index.module.css";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import Image from "~/components/Image";
import Page from "~/components/Page";
import { ErrorPage } from "~/components/ErrorPage";

export const ErrorBoundary = ErrorPage;

export const loader = async ({ params, request, context: { payload }}: LoaderArgs) => {
  const data = await payload.find({
    collection: 'filmPrints',
    where: {
      slug: {
        equals: params.filmPrintSlug,
      },
    },
    locale: await i18next.getLocale(request),
    depth: 11,
  });
  
  if (!data.docs.length) {
    throw new Response('Film print not found', { status: 404 });
  }
  
  return {
    filmPrint: data.docs[0],
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: data?.filmPrint?.title,
  }
};

export default function Item() {
  const { filmPrint } = useLoaderData<typeof loader>();
  const movie = filmPrint.movie as MovieType;
  const { t } = useTranslation();

  return (
    <Page className={classes.container}>
      <h1>{movie.title}</h1>
      <Image
        className={classes.header}
        image={movie.still as Media}
        sizes="100vw"
        alt={t('movie still') as string}
      />
      <main>
        <Movie
          movie={movie}
          filmprint={filmPrint}
        />
      </main>
    </Page>
  );
}