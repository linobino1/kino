import React from 'react';
import classes from './index.module.css';
import type {
  FilmPrint,
  Media,
  Movie,
  Screening,
  ScreeningSery,
} from 'payload/generated-types';
import { Date } from '~/components/Date';
import { useTranslation } from 'react-i18next';
import Image from '~/components/Image';

type Props = {
  screening: Screening
  activeScreeningSery?: ScreeningSery
};

export const ScreeningsListItem: React.FC<Props> = ({
  screening, activeScreeningSery,
}) => {
  const { t } = useTranslation();

  return (
    <div className={classes.screening}>
      <div className={classes.date}>
        <Date
          iso={screening.date as string}
          className={classes.dayName}
          format="EEEEEE"
        />
        <Date
          iso={screening.date as string}
          className={classes.month}
          format="MMM"
        />
        <Date
          iso={screening.date as string}
          className={classes.dayNumber}
          format="dd"
        />
      </div>
      <Image
        image={((screening.featureFilms[0] as FilmPrint)?.movie as Movie)?.still as Media}
        alt={t('movie still') as string}
      />
      <div className={classes.info}>
        <div className={classes.tags}>
          { screening.series && (
              activeScreeningSery?.id !== (screening.series as ScreeningSery)?.id
            ) && (
              <div className={`${classes.tag} ${classes.series}`}>
                {(screening.series as ScreeningSery).name}
              </div>
            )
          }
        </div>
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
