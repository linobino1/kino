import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
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
import { ScreeningInfo } from "~/components/ScreeningInfo";
import HeaderImage from "~/components/HeaderImage";
import { JsonLd } from "cms/structured-data";
import { screeningSchema } from "cms/structured-data/screening";
import { mergeMeta, pageTitle } from "~/util/pageMeta";
import type { loader as rootLoader } from "app/root";
import { parseISO } from "date-fns";
import { format } from "date-fns-tz";
import { useTranslation } from "react-i18next";

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
  const site = await payload.findGlobal({
    slug: "site",
  });

  const data = await payload.find({
    collection: "screenings",
    where: {
      slug: {
        equals: params.screeningSlug,
      },
    },
    locale,
    depth: 6,
  });

  if (!data.docs.length) {
    throw new Response("Screening not found", { status: 404 });
  }

  return {
    screening: data.docs[0],
    navigation,
    site,
  };
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
    date: format(parseISO(data?.screening.date || ""), "PPp"),
  });
  const description = t("screening.meta.description", {
    date: format(parseISO(data?.screening.date || ""), "PPpp"),
    synopsis: (
      (data?.screening.featureFilms[0] as FilmPrint).movie as MovieType
    ).synopsis,
  });
  return [
    {
      title: pageTitle(site?.meta?.title, title),
    },
    {
      name: "description",
      content: description,
    },
    {
      name: "og:title",
      content: pageTitle(site?.meta?.title, title),
    },
    {
      name: "og:image",
      content: (
        ((data?.screening.featureFilms[0] as FilmPrint).movie as MovieType)
          .still as Media
      ).url,
    },
  ];
});

export default function Item() {
  const { screening, navigation, site } = useLoaderData<typeof loader>();
  const mainMovie = (screening.featureFilms[0] as FilmPrint).movie as MovieType;
  const featureFilms = (screening.featureFilms as FilmPrint[]) ?? [];
  const supportingFilms = (screening.supportingFilms as FilmPrint[]) ?? [];
  const allFilms = [...featureFilms, ...supportingFilms];

  const inlineScreeningInfo = allFilms.length <= 1;

  return (
    <Page className={classes.container}>
      {JsonLd(screeningSchema(screening, site))}
      <HeaderImage image={mainMovie.still} navigation={navigation}>
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
      <main>
        <div className={classes.movies}>
          {allFilms.map((filmprint, i) => (
            <Movie
              key={filmprint.id}
              movie={filmprint.movie as MovieType}
              filmprint={filmprint}
              screening={screening}
              showScreeningInfo={inlineScreeningInfo}
            />
          ))}
        </div>
        {!inlineScreeningInfo && <ScreeningInfo screening={screening} />}
      </main>
    </Page>
  );
}
