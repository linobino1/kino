import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type {
  FilmPrint,
  Movie as MovieType,
  ScreeningGroup,
  Location,
  Poster as PosterType,
  Still as StillType,
  ScreeningSery,
} from "payload/generated-types";
import { Movie } from "~/components/Movie";
import classes from "./index.module.css";
import { Date } from "~/components/Date";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import Poster from "~/components/Poster";
import Still from "~/components/Still";
import Page from "~/components/Page";

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
    <Page>
      <h1 className={classes.title}>
        <span>{(screening.group as ScreeningGroup).name}</span>
        <span className={classes.subtitle}>{screening.title}</span>
      </h1>
      <div className={classes.imageHeader}>
        <Still
          className={classes.headerImage}
          image={mainMovie.still as StillType}
          srcSet={[
            { size: 'landscape-2560w', width: 2560 },
            { size: 'landscape-1920w', width: 1920 },
            { size: 'landscape-1280w', width: 1280 },
            { size: 'square-768w', width: 768 },
            { size: 'square-512w', width: 512 },
          ]}
          sizes={[
            '95vw',
          ]}
        />
        <div className={classes.imageHeaderOverlay}>
          <div className={classes.imageHeaderOverlayContent}>
            <div className={classes.posters}>
              { (screening.featureFilms as FilmPrint[]).map((filmprint) => (
                <div key={filmprint.id} className={classes.poster}>
                  <Poster
                    image={(filmprint.movie as MovieType).poster as PosterType}
                    srcSet={[
                      { size: '260w', width: 260 },
                    ]}
                    sizes={[
                      '260px',
                    ]}
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
                iso={screening.date as string}
                format="p"
              />
              <br />
              <div className={`${classes.location} ${classes.tag}`}>
                {(screening.location as Location).name}
              </div>
              { screening.group && (
                <div className={`${classes.series} ${classes.tag}`}>
                  {(screening.series as ScreeningSery)?.name}
                </div>
              )}
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
                filmprint={filmprint}
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
    </Page>
  );
}