import type {
  Movie as MovieType,
  Country,
  Person,
  Poster as PosterType,
} from "payload/generated-types";
import React from "react";
import classes from './index.module.css';
import { Poster } from "~/components/Poster";

export type Props = {
  movie: MovieType
};

export const Movie: React.FC<Props> = ({ movie }) => {
  const specs = [
    movie.originalTitle,
    (movie.country as Country[]).map((x) => x.name).join(', '),
    movie.year,
    (movie.directors as Person[]).map((x) => x.name).join(', '),
  ].filter(Boolean);

  return (
    <div className={classes.movie}>
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