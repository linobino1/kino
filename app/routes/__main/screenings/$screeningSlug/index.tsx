import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type {
  FilmPrint,
  Movie as MovieType,
  Location,
  ScreeningSery,
  Season,
} from "payload/generated-types";
import { Movie } from "~/components/Movie";
import classes from "./index.module.css";
import { Date } from "~/components/Date";
import i18next from "~/i18next.server";
import Page from "~/components/Page";
import { Response } from '@remix-run/node';
import { ScreeningInfo } from "~/components/ScreeningInfo";
import HeaderImage from "~/components/HeaderImage";

export const loader = async ({ params, request, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const navigation = (await payload.find({
    collection: 'navigations',
    where: {
      type: {
        equals: 'socialMedia',
      },
    },
  })).docs[0];
    
  const data = await payload.find({
    collection: 'screenings',
    where: {
      slug: {
        equals: params.screeningSlug,
      },
    },
    locale,
    depth: 6,
  });
  
  if (!data.docs.length) {
    throw new Response('Screening not found', { status: 404 });
  }
  
  return {
    screening: data.docs[0],
    navigation,
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: data?.screening.title,
  }
};

export default function Item() {
  const { screening, navigation } = useLoaderData<typeof loader>();
  const mainMovie = (screening.featureFilms[0] as FilmPrint).movie as MovieType;
  const featureFilms = (screening.featureFilms as FilmPrint[]) ?? [];
  const supportingFilms = (screening.supportingFilms as FilmPrint[]) ?? [];
  const allFilms = [...supportingFilms, ...featureFilms];

  const inlineScreeningInfo = allFilms.length <= 1;

  return (
    <Page className={classes.container}>
      <HeaderImage image={mainMovie.still} navigation={navigation} >
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
          <Link className={classes.season} to={(screening.season as Season).url}>
            {(screening.season as Season).name}
          </Link>
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
      </HeaderImage>
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