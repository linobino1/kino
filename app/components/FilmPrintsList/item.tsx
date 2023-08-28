import React from 'react';
import type {
  Country,
  FilmPrint,
  Media,
  Movie,
  Person,
} from 'payload/generated-types';
import { useTranslation } from 'react-i18next';
import { Image } from '~/components/Image';
import classes from './index.module.css';

type Props = {
  item: FilmPrint
};

export const FilmPrintsListItem: React.FC<Props> = ({
  item,
}) => {
  const { t } = useTranslation();
  const movie = item.movie as Movie;

  return (
    <div className={classes.item}>
      <Image
        className={classes.image}
        image={movie.still as Media}
        srcSet_={[
          { size: '320x160', width: 380 },
          { size: '768x384', width: 768 },
        ]}
        sizes_={[
          '380px',
          '750px',
        ]}
        alt={t('movie still') as string}
      />
      <div className={classes.overlay}>
        <div className={classes.title}>
          {movie.title}
        </div>
        <div className={classes.subtitle}>
          <b>
            {(movie.directors as Person[] || []).map((x) => x.name).join(', ')}
          </b>
          {' '}
          {(movie.countries as Country[] || []).map((x) => x.name).join(', ')}
          {', '}
          {movie.year}
        </div>
      </div>
      <div className={classes.info}>
        <div className={classes.synopsis}>{movie.synopsis}</div>
        <div className={classes.moreInfo}>
          {t('More Info')}
        </div>
      </div>
    </div>
  );
};

export default FilmPrintsListItem;
