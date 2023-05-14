import type {
  Movie as MovieType,
  Country,
  Person,
  Poster as PosterType,
  FilmPrint,
  Format,
  LanguageVersion,
} from "payload/generated-types";
import React from "react";
import classes from './index.module.css';
import { Poster } from "~/components/Poster";
import { useTranslation } from "react-i18next";

export type Props = {
  movie: MovieType
  filmprint?: FilmPrint
  className?: string
};

export const Movie: React.FC<Props> = ({
  movie, filmprint, className,
}) => {
  const { t } = useTranslation();
  const specs = [
    movie.originalTitle,
    (movie.countries as Country[]).map((x) => x.name).join(', '),
    movie.year,
    (movie.directors as Person[]).map((x) => x.name).join(', '),
    filmprint ? (filmprint.format as Format).name : null,
    filmprint ? `${filmprint.duration}m` : null,
    filmprint ? (filmprint.languageVersion as LanguageVersion)?.name : null,
    (filmprint && parseInt(filmprint.ageRating || '') > 0) ? t('ageRating', { age: filmprint.ageRating}) : null
  ].filter(Boolean);

  return (
    <div className={`${classes.movie} ${className}`}>
      <div className={classes.poster}>
        <Poster
          image={movie.poster as PosterType}
          srcSet={[
            { size: '120w', width: 768 },
            { size: '260w', width: 512 },
          ]}
          sizes={[
            '95vw',
          ]}
        />
      </div>
      <div className={classes.movieInfo}>
        <h2 className={classes.movieTitle}>{movie.title}</h2>
        <div className={classes.movieSpecs}>
          { specs.map((spec, i) => (
            <div className={classes.movieSpecsItem} key={i}>{spec}</div>
          ))}
        </div>
        <div className={classes.synopsis}>{movie.synopsis}</div>
      </div>
    </div>

  );
};

export default Movie;