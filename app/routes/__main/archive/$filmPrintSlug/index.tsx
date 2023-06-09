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
  
  return {
    filmPrint: data.docs[0],
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: data.filmPrint.title,
  }
};

export default function Item() {
  const { filmPrint } = useLoaderData<typeof loader>();
  const movie = filmPrint.movie as MovieType;
  const { t } = useTranslation();

  return (
    <Page>
      <h1 className={classes.title}>
        <span className={classes.subtitle}>{movie.title}</span>
      </h1>
      <div className={classes.imageHeader}>
        <Image
          className={classes.headerImage}
          image={movie.still as Media}
          srcSet={[
            { size: '2560x1706', width: 2560 },
            { size: '1920x1280', width: 1920 },
            { size: '1280x853', width: 1280 },
            { size: '768x768', width: 768 },
            { size: '512x512', width: 512 },
          ]}
          sizes={[
            '95vw',
          ]}
          alt={t('movie still') as string}
        />
        <div className={classes.imageHeaderOverlay}>
          <div className={classes.imageHeaderOverlayContent}>
            <div className={classes.posters}>
              <div className={classes.poster}>
                <Image
                  image={movie.poster as Media}
                  srcSet={[
                    { size: '260x390', width: 260 },
                  ]}
                  sizes={[
                    '260px',
                  ]}
                  alt={t('movie poster') as string}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className={classes.movies}>
          <Movie
            movie={movie}
            filmprint={filmPrint}
          />
        </div>
      </main>
    </Page>
  );
}