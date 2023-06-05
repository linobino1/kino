import type {
  Movie as MovieType,
  Country,
  Person,
  FilmPrint,
  LanguageVersion,
  Rental,
  Media,
} from "payload/generated-types";
import React from "react";
import classes from './index.module.css';
import { useTranslation } from "react-i18next";
import Image from "~/components/Image";

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
    (movie.countries as Country[])?.map((x) => x.name).join(', '),
    movie.year,
    (movie.directors as Person[])?.map((x) => x.name).join(', '),
    t('duration {duration}', { duration: movie.duration }),
    movie.ageRating ? t('ageRating {age}', { age: movie.ageRating}) : null,
    filmprint ? (filmprint.languageVersion as LanguageVersion)?.name : null,
  ].filter(Boolean);

  return (
    <div className={`${classes.movie} ${className}`}>
      <div className={classes.poster}>
        <Image
          image={movie.poster as Media}
          srcSet={[
            { size: '120x180', width: 768 },
            { size: '260x390', width: 512 },
          ]}
          sizes={[
            '95vw',
          ]}
          alt={t('movie poster') as string}
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
        { (filmprint?.rental as Rental) && (
          <>
            <br />
            <span>{t('rentalCredits', { rental: (filmprint?.rental as Rental)?.name })}</span>
            { (filmprint?.rental as Rental)?.logo && (
              <div className={classes.rentalLogo}>
                <Image image={((filmprint?.rental as Rental)?.logo as Media)} />
              </div>
            )}
          </>
        )}
      </div>
    </div>

  );
};

export default Movie;