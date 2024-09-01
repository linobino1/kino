import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type {
  FilmPrint,
  Movie as MovieType,
  Location,
  ScreeningSery,
  Season,
  Media,
  Event,
  Navigation,
  Site,
} from "payload/generated-types";
import { MovieInfo } from "~/components/MovieInfo";
import classes from "./index.module.css";
import { Date } from "~/components/Date";
import Page from "~/components/Page";
import HeaderImage from "~/components/HeaderImage";
import { JsonLd } from "cms/structured-data";
import { eventSchema } from "cms/structured-data/screening";
import { mergeMeta, pageTitle } from "~/util/pageMeta";
import type { loader as rootLoader } from "app/root";
import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useTranslation } from "react-i18next";
import RichText from "~/components/RichText";
import Gutter from "~/components/Gutter";
import { cacheControlVeryShortCacheButLongSWR } from "~/util/cache-control/cacheControlVeryShortCacheButLongSWR";
import environment from "~/util/environment";
import { serializeToPlainText } from "~/components/RichText/Serialize";
import EventInfo from "~/components/EventInfo";
import { routeHeaders } from "~/util/cache-control/routeHeaders";
import { Link } from "~/components/localized-link";

export const loader = async ({
  params,
  request,
  context: { payload },
  params: { lang: locale },
}: LoaderFunctionArgs) => {
  const [navigationResponse, eventResponse] = await Promise.all([
    payload.find({
      collection: "navigations",
      where: {
        type: {
          equals: "socialMedia",
        },
      },
    }),
    payload.find({
      collection: "events",
      where: {
        slug: {
          equals: params.eventSlug,
        },
      },
      locale,
      depth: 8,
    }),
  ]);

  const navigation = navigationResponse.docs[0];
  const event = eventResponse.docs[0];

  if (!event) {
    throw new Response("Screening not found", { status: 404 });
  }

  return json(
    {
      event,
      navigation,
    },
    {
      headers: {
        "Cache-Control": cacheControlVeryShortCacheButLongSWR,
      },
    }
  );
};

export const headers = routeHeaders;

export const meta: MetaFunction<
  typeof loader,
  {
    root: typeof rootLoader;
  }
> = mergeMeta(({ data, matches }) => {
  const { t } = useTranslation();
  const site = matches.find((match) => match?.id === "root")?.data.site;
  const event = data?.event as unknown as Event;

  const title = t("event.meta.title", {
    title: event.title,
    date: formatInTimeZone(
      parseISO(event?.date || ""),
      environment().TIMEZONE,
      "PPp"
    ),
  });
  const image = (event.header as Media).url;
  const description =
    event.type === "event"
      ? serializeToPlainText({ content: event.info })
      : // description is more specific for screenings
        t("screening.meta.description", {
          date: formatInTimeZone(
            parseISO(event.date || ""),
            environment().TIMEZONE,
            "PPpp"
          ),
          synopsis: (
            (event.films?.[0]?.filmprint as FilmPrint).movie as MovieType
          ).synopsis,
        });

  return [
    {
      title: pageTitle(site?.meta?.title ?? undefined, title),
    },
    {
      name: "og:title",
      content: pageTitle(site?.meta?.title ?? undefined, title),
    },
    {
      name: "description",
      content: description,
    },
    {
      name: "og:description",
      content: description,
    },
    {
      name: "og:image",
      content: image,
    },
  ];
});

export default function Item() {
  const loaderData = useLoaderData<typeof loader>();
  const routeLoaderData = useRouteLoaderData<typeof rootLoader>("root");
  const event = loaderData.event as unknown as Event;
  const navigation = loaderData.navigation as unknown as Navigation;
  const site = routeLoaderData?.site as unknown as Site;

  return (
    <Page className={classes.container}>
      {JsonLd(eventSchema(event, site))}
      <HeaderImage
        image={event.header as Media}
        navigation={navigation}
        className={classes.header}
      >
        <div className={classes.infoTitle}>
          <Date
            className={classes.date}
            iso={event.date as string}
            format="P / p"
          />
          <br />
          <div className={classes.location}>
            {(event.location as Location).name}
          </div>
          <Link
            className={classes.season}
            to={(event.season as Season).url}
            prefetch="intent"
          >
            {(event.season as Season).name}
          </Link>
          <div className={classes.title}>{event.title}</div>
          {event.series && (
            <a
              href={`/screening-series/${(event.series as ScreeningSery).slug}`}
              className={`${classes.series} ${classes.tag}`}
            >
              {(event.series as ScreeningSery)?.name}
            </a>
          )}
        </div>
      </HeaderImage>
      <Gutter>
        {event.type === "screening" && event.info && (
          <RichText content={event.info} className={classes.info} />
        )}
        <div className={classes.main}>
          {event.type === "screening" &&
            event.films?.map((film, i) => (
              <MovieInfo
                key={i}
                movie={(film.filmprint as FilmPrint).movie as MovieType}
                filmprint={film.filmprint as FilmPrint}
                isSupportingFilm={!!film.isSupportingFilm}
                info={film.info}
              />
            ))}
          {event.type === "event" && <EventInfo event={event} />}
        </div>
      </Gutter>
    </Page>
  );
}
