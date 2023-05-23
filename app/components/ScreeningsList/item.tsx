import React from 'react';
import classes from './index.module.css';
import type {
  FilmPrint,
  Movie,
  Screening,
  ScreeningSery,
  Still as StillType,
} from 'payload/generated-types';
import { Date } from '~/components/Date';
import { useTranslation } from 'react-i18next';
import Still from '~/components/Still';

type Props = {
  screening: Screening
};

export const ScreeningsListItem: React.FC<Props> = ({ screening }) => {
  const { t } = useTranslation();

  return (
    <div
      className={classes.screening}
    >
      <div className={classes.date}>
        <Date
          iso={screening.date as string}
          className={classes.dayName}
          format="EEEEEE"
        />
        <Date
          iso={screening.date as string}
          className={classes.dayNumber}
          format="ii"
        />
        <Date
          iso={screening.date as string}
          className={classes.month}
          format="MMM"
        />
      </div>
      <div className={classes.imgWrapper}>
        <Still
          image={((screening.featureFilms[0] as FilmPrint)?.movie as Movie)?.still as StillType}
          srcSet={[
            { size: '320w', width: 380 },
          ]}
          sizes={[
            '320px',
          ]}
        />
      </div>
      <div className={classes.tags}>
        { screening.series && (
          <div className={`${classes.tag} ${classes.series}`}>
            {(screening.series as ScreeningSery).name}
          </div>
        )}
      </div>
      <div className={classes.info}>
        <Date
          iso={screening.date as string}
          className={classes.time}
          format="p"
        />
        <div className={classes.title}>
          { screening.title }
        </div>
        <div className={classes.footer}>
          {t('More Info')}
        </div>
      </div>
    </div>
  );
};

export default ScreeningsListItem;
