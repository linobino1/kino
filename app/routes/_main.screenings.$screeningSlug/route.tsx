import type {
  HeadersFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type {
  FilmPrint,
  Movie as MovieType,
  Location,
  ScreeningSery,
  Season,
  Media,
} from "payload/generated-types";
import { Movie } from "~/components/Movie";
import classes from "./index.module.css";
import { Date } from "~/components/Date";
import i18next from "~/i18next.server";
import Page from "~/components/Page";
import HeaderImage from "~/components/HeaderImage";
import { JsonLd } from "cms/structured-data";
import { screeningSchema } from "cms/structured-data/screening";
import { mergeMeta, pageTitle } from "~/util/pageMeta";
import type { loader as rootLoader } from "app/root";
import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useTranslation } from "react-i18next";
import RichText from "~/components/RichText";
import Gutter from "~/components/Gutter";
import { cacheControlVeryShortCacheButLongSWR } from "~/util/cacheControl";
import environment from "~/util/environment";

export const loader = async ({
  params,
  request,
  context: { payload },
}: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const navigation = (
    await payload.find({
      collection: "navigations",
      where: {
        type: {
          equals: "socialMedia",
        },
      },
    })
  ).docs[0];

  const data = await payload.find({
    collection: "screenings",
    where: {
      slug: {
        equals: params.screeningSlug,
      },
    },
    locale,
    depth: 8,
  });

  if (!data.docs.length) {
    throw new Response("Screening not found", { status: 404 });
  }

  return json(
    {
      screening: data.docs[0],
      navigation,
    },
    {
      headers: {
        "Cache-Control": cacheControlVeryShortCacheButLongSWR,
      },
    }
  );
};

export const meta: MetaFunction<
  typeof loader,
  {
    root: typeof rootLoader;
  }
> = mergeMeta(({ data, matches }) => {
  const { t } = useTranslation();
  const site = matches.find((match) => match?.id === "root")?.data.site;
  const title = t("screening.meta.title", {
    title: data?.screening.title,
    date: formatInTimeZone(
      parseISO(data?.screening.date || ""),
      environment().TIMEZONE,
      "PPp"
    ),
  });
  const description = t("screening.meta.description", {
    date: formatInTimeZone(
      parseISO(data?.screening.date || ""),
      environment().TIMEZONE,
      "PPpp"
    ),
    synopsis: (
      (data?.screening.films[0].filmprint as FilmPrint).movie as MovieType
    ).synopsis,
  });
  return [
    {
      title: pageTitle(site?.meta?.title || undefined, title),
    },
    {
      name: "description",
      content: description,
    },
    {
      name: "og:title",
      content: pageTitle(site?.meta?.title || undefined, title),
    },
    {
      name: "og:image",
      content: (
        ((data?.screening.films[0].filmprint as FilmPrint).movie as MovieType)
          .still as Media
      ).url,
    },
  ];
});

export const headers: HeadersFunction = () => ({
  "Cache-Control": cacheControlVeryShortCacheButLongSWR,
});

export default function Item() {
  const { screening, navigation } = useLoaderData<typeof loader>();
  const { site } = useRouteLoaderData<typeof rootLoader>("root")!;
  const mainMovie = (screening.films[0].filmprint as FilmPrint)
    .movie as MovieType;

  return (
    <Page className={classes.container}>
      {JsonLd(screeningSchema(screening, site))}
      <HeaderImage
        image={mainMovie.still}
        navigation={navigation}
        className={classes.header}
      >
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
          <Link
            className={classes.season}
            to={(screening.season as Season).url}
          >
            {(screening.season as Season).name}
          </Link>
          <div className={classes.title}>{screening.title}</div>
          {screening.series && (
            <a
              href={`/screening-series/${
                (screening.series as ScreeningSery).slug
              }`}
              className={`${classes.series} ${classes.tag}`}
            >
              {(screening.series as ScreeningSery)?.name}
            </a>
          )}
        </div>
      </HeaderImage>
      <Gutter>
        {screening.info && (
          <RichText content={screening.info} className={classes.info} />
        )}
        <div className={classes.movies}>
          {screening.films.map((film, i) => (
            <Movie
              key={i}
              movie={(film.filmprint as FilmPrint).movie as MovieType}
              filmprint={film.filmprint as FilmPrint}
              isSupportingFilm={!!film.isSupportingFilm}
              info={film.info}
            />
          ))}
        </div>
      </Gutter>
    </Page>
  );
}
