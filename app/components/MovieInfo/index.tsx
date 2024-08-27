import type {
  Movie as MovieType,
  Country,
  Person,
  FilmPrint,
  LanguageVersion,
  Rental,
  Media,
  Format,
  Genre,
} from "payload/generated-types";
import React from "react";
import classes from "./index.module.css";
import { useTranslation } from "react-i18next";
import Image from "~/components/Image";
import RichText from "../RichText";
import { Link } from "~/components/localized-link";

export interface Props extends React.HTMLAttributes<HTMLElement> {
  movie: MovieType;
  filmprint?: FilmPrint;
  isSupportingFilm?: boolean;
  info?: any; // additional info to show, richtext
}

export const MovieInfo: React.FC<Props> = ({
  movie,
  filmprint,
  className,
  isSupportingFilm,
  info,
  ...props
}) => {
  const { t } = useTranslation();

  const specs = [
    movie.originalTitle,
    (movie.genres as Genre[]).map((x) => x.name).join(", "),
    (movie.countries as Country[])?.map((x) => x.name).join(", "),
    movie.year,
    movie.directors &&
      t("directed by {directors}", {
        directors: (movie.directors as Person[])?.map((x) => x.name).join(", "),
      }),
    t("duration {duration}", { duration: movie.duration }),
    (filmprint?.format as Format).name,
    // movie.ageRating ? t('ageRating {age}', { age: movie.ageRating}) : null,
    filmprint ? (filmprint.languageVersion as LanguageVersion)?.name : null,
    movie.cast &&
      t("starring {actors}", {
        actors: (movie.cast as Person[])
          ?.slice(0, 3)
          .map((x) => x.name)
          .join(", "),
      }),
  ].filter(Boolean);

  return (
    <div className={`${classes.container} ${className}`} {...props}>
      <Image
        className={classes.poster}
        image={movie.poster as Media}
        alt={t("movie poster") as string}
        srcSet={[
          { options: { width: 260 }, size: "260w" },
          { options: { width: 520 }, size: "520w" },
        ]}
        sizes="260px"
      />
      <h2>
        {isSupportingFilm && (
          <span className={classes.supportingFilm}>
            {t("Supporting Film")}:&nbsp;
          </span>
        )}
        {movie.title}
      </h2>
      <ul className={classes.specs}>
        {specs.map((spec, i) => (
          <li
            key={i}
            dangerouslySetInnerHTML={{
              __html: spec as string,
            }}
          />
        ))}
      </ul>
      <p
        className={classes.synopsis}
        dangerouslySetInnerHTML={{
          __html: movie.synopsis as string,
        }}
      />
      {info && <RichText className={classes.info} content={info} />}
      {movie.trailer && (
        <Link className={classes.trailer} to={movie.trailer} target="_blank">
          {t("Trailer")}
        </Link>
      )}
      {(filmprint?.rental as Rental) && (
        <div className={classes.rental}>
          <div
            dangerouslySetInnerHTML={{
              __html: (filmprint?.rental as Rental).credits as string,
            }}
          />
          {(filmprint?.rental as Rental)?.logo && (
            <Image
              className={classes.rentalLogo}
              image={(filmprint?.rental as Rental)?.logo as Media}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MovieInfo;
