import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type {
  FilmPrint,
  Movie as MovieType,
  ScreeningGroup,
  Location,
  Media,
} from "payload/generated-types";
import { Movie } from "~/components/Movie";
import classes from "./index.module.css";
import { Date } from "~/components/Date";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import Image from "~/components/Image";

export const loader = async ({ params, request, context: { payload }}: LoaderArgs) => {
  const data = await payload.find({
    collection: 'screenings',
    where: {
      slug: {
        equals: params.screeningSlug,
      },
    },
    locale: await i18next.getLocale(request),
    depth: 11,
  });
  
  return {
    screening: data.docs[0],
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: data.screening.title,
  }
};

export default function Item() {
  const { screening } = useLoaderData<typeof loader>();
  const mainMovie = (screening.featureFilms[0] as FilmPrint).movie as MovieType;
  const featureFilms = (screening.featureFilms as FilmPrint[]) ?? [];
  const supportingFilms = (screening.supportingFilms as FilmPrint[]) ?? [];
  const { t } = useTranslation();


  return (
    <>
      <h1 className={classes.title}>
        <span>{(screening.group as ScreeningGroup).name}</span>
        <span className={classes.subtitle}>{screening.title}</span>
      </h1>
      <div className={classes.imageHeader}>
        <Image
          className={classes.headerImage}
          image={mainMovie.still as Media}
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
              { (screening.featureFilms as FilmPrint[]).map((filmprint) => (
                <div key={filmprint.id} className={classes.poster}>
                  <Image
                    image={(filmprint.movie as MovieType).poster as Media}
                    srcSet={[
                      { size: '260x390', width: 260 },
                    ]}
                    sizes={[
                      '260px',
                    ]}
                    alt={t('movie poster') as string}
                  />
                </div>
              ))}
            </div>
            <div className={classes.infoTitle}>
              <Date
                className={classes.date}
                iso={screening.date as string}
                format="P"
              />
              <br />
              <Date
                className={classes.time}
                iso={screening.time as string}
                format="p"
              />
              <br />
              <div className={classes.location}>{(screening.location as Location).name}</div>
              { supportingFilms.map((filmprint) => (
                <div key={filmprint.id} className={classes.movieTitle}>
                  {(filmprint.movie as MovieType).title}
                </div>
              ))}
              { featureFilms.map((filmprint) => (
                <div key={filmprint.id} className={classes.movieTitle}>
                  {(filmprint.movie as MovieType).title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className={classes.movies}>
          { (screening.featureFilms as FilmPrint[]).map((filmprint) => (
            <div key={filmprint.id}>
              <Movie
                movie={filmprint.movie as MovieType}
                // filmprint={filmprint}
              />
              <hr />
            </div>
          ))}
          { screening.guest && (
            <div className={classes.discussion}>
              { t('Film talk with {{guests}} moderated by {{moderator}}', {
                guests: screening.guest,
                moderator: screening.moderator,
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}