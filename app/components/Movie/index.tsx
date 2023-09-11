import type {
  Movie as MovieType,
  Country,
  Person,
  FilmPrint,
  LanguageVersion,
  Rental,
  Media,
  Format,
  Screening,
} from "payload/generated-types";
import React from "react";
import classes from './index.module.css';
import { useTranslation } from "react-i18next";
import Image from "~/components/Image";
import { Link } from "@remix-run/react";
import ScreeningInfo from "../ScreeningInfo";

export interface Props extends React.HTMLAttributes<HTMLElement> {
  movie: MovieType
  filmprint?: FilmPrint
  screening?: Screening
  showScreeningInfo?: boolean
};

export const Movie: React.FC<Props> = (props) => {
  const { movie, filmprint, className, showScreeningInfo } = props;
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
    <div className={`${classes.container} ${className}`} {...props}>
      <Image
        className={classes.poster}
        image={movie.poster as Media}
        srcset_={[
          { size: '120w', css: '120w' },
          { size: '260w', css: '260w' },
          { size: '350w', css: '350w' },
          { size: '520w', css: '520w' },
        ]}
        alt={t('movie poster') as string}
      />
      <h2>{movie.title}</h2>
      <ul className={classes.specs}>
        { specs.map((spec, i) => (
          <li key={i}>{spec}</li>
        ))}
      </ul>
      <p
        className={classes.synopsis}
        dangerouslySetInnerHTML={{
          __html: movie.synopsis as string
        }}
      />
      { showScreeningInfo && props.screening && (
        <ScreeningInfo screening={props.screening as Screening} />
      )}
      { movie.trailer && (
        <Link
          className={classes.trailer}
          to={movie.trailer}
          target="_blank"
        >{t('Trailer')}</Link>
      )}
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