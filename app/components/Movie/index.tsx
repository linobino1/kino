import type {
  Movie as MovieType,
  Country,
  Person,
  FilmPrint,
  LanguageVersion,
  Rental,
  Media,
  Format,
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
    (filmprint?.format as Format).name,
    movie.ageRating ? t('ageRating {age}', { age: movie.ageRating}) : null,
    filmprint ? (filmprint.languageVersion as LanguageVersion)?.name : null,
  ].filter(Boolean);

  return (
    <div className={`${classes.container} ${className}`}>
      <Image
        className={classes.poster}
        image={movie.poster as Media}
        srcset_={[
          { size: '120w', width: 120 },
          { size: '260w', width: 260 },
          { size: '350w', width: 350 },
          { size: '520w', width: 520 },
        ]}
        alt={t('movie poster') as string}
      />
      <h2>{movie.title}</h2>
      <ul className={classes.specs}>
        { specs.map((spec, i) => (
          <li key={i}>{spec}</li>
        ))}
      </ul>
      <div className={classes.synopsis}>{movie.synopsis}</div>
      { (filmprint?.rental as Rental) && (
        <div className={classes.rental}>
          <div
            dangerouslySetInnerHTML={{
              __html: t('rentalCredits', { rental: (filmprint?.rental as Rental)?.name }) as string,
            }}
          />
          { (filmprint?.rental as Rental)?.logo && (
            <Image
              className={classes.rentalLogo}
              image={((filmprint?.rental as Rental)?.logo as Media)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Movie;