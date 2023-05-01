import React from 'react';
import type {
  Country,
  FilmPrint,
  Movie,
  Still as StillType,
  Person,
} from 'payload/generated-types';
import { useTranslation } from 'react-i18next';
import { Still } from '~/components/Still';
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
    <div
      className={classes.item}
    >
      <div className={classes.imgWrapper}>
        <Still
          image={movie.still as StillType}
          srcSet={[
            { size: '320w', width: 380 },
            { size: '768w', width: 768 },
          ]}
          sizes={[
            '380px',
            '750px',
          ]}
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
      </div>
      <div className={classes.info}>
        { movie.synopsis }
        <div className={classes.moreInfo}>
          {t('More Info')}
        </div>
      </div>
    </div>
  );
};

export default FilmPrintsListItem;
