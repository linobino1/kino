import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type {
  FilmPrint,
  Movie as MovieType,
  Location,
  ScreeningSery,
  Media,
} from "payload/generated-types";
import { Movie } from "~/components/Movie";
import classes from "./index.module.css";
import { Date } from "~/components/Date";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import Page from "~/components/Page";
import Image from "~/components/Image";
import { Response } from '@remix-run/node';
import { ScreeningInfo } from "~/components/ScreeningInfo";

export const loader = async ({ params, request, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const data = await payload.find({
    collection: 'screenings',
    where: {
      slug: {
        equals: params.screeningSlug,
      },
    },
    locale,
    depth: 11,
  });
  
  if (!data.docs.length) {
    throw new Response('Screening not found', { status: 404 });
  }
  
  return {
    screening: data.docs[0],
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: data?.screening.title,
  }
};

export default function Item() {
  const { screening } = useLoaderData<typeof loader>();
  const mainMovie = (screening.featureFilms[0] as FilmPrint).movie as MovieType;
  const featureFilms = (screening.featureFilms as FilmPrint[]) ?? [];
  const supportingFilms = (screening.supportingFilms as FilmPrint[]) ?? [];
  const allFilms = [...supportingFilms, ...featureFilms];
  const { t } = useTranslation();

  const inlineScreeningInfo = allFilms.length <= 1;

  return (
    <Page>
      <div className={classes.imageHeader}>
        <Image
          className={classes.headerImage}
          image={mainMovie.still as Media}
          sizes="100vw"
          alt={t('movie still') as string}
        />
        <div className={classes.imageHeaderOverlay}>
          <div className={classes.imageHeaderOverlayContent}>
            <div className={classes.posters}>
              { allFilms.map((filmprint) => (
                <Image
                  key={filmprint.id}
                  className={classes.poster}
                  image={(filmprint.movie as MovieType).poster as Media}
                  srcset_={[
                    { size: '120w', css: '120w' },
                    { size: '260w', css: '260w' },
                  ]}
                  alt={t('movie poster') as string}
                />
              ))}
            </div>
            <div className={classes.infoTitle}>
              <Date
                className={classes.date}
                iso={screening.date as string}
                format="P / p"
              />
              <br />
              <div className={classes.location}>
                {(screening.location as Location).name}
              </div>
              { allFilms.map((filmprint) => (
                <div key={filmprint.id} className={classes.movieTitle}>
                  {(filmprint.movie as MovieType).title}
                </div>
              ))}
              { screening.series && (
                <a
                  href={`/screening-series/${(screening.series as ScreeningSery).slug}`}
                  className={`${classes.series} ${classes.tag}`}
                >
                  {(screening.series as ScreeningSery)?.name}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className={classes.movies}>
          { allFilms.map((filmprint, i) => (
            <Movie
              key={filmprint.id}
              movie={filmprint.movie as MovieType}
              filmprint={filmprint}
              screening={screening}
              showScreeningInfo={inlineScreeningInfo}
            />
          ))}
        </div>
        { !inlineScreeningInfo && (
          <ScreeningInfo screening={screening} />
        )}
      </main>
    </Page>
  );
}