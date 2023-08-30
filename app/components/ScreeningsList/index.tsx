import { ScreeningsListItem } from './item';
import { Link } from '@remix-run/react';
import type { Screening, ScreeningSery } from 'payload/generated-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import classes from './index.module.css';

export type Props = {
  from?: string
  items: Screening[]
  className?: string
  activeScreeningSery?: ScreeningSery
}

export const ScreeningsList: React.FC<Props> = ({
  items, className, activeScreeningSery,
}) => {
  const { t } = useTranslation(); 

  return items?.length ? (
    <div className={`${classes.list} ${className || ''}`}>
      {items.map((item) => (
        <Link to={`/screenings/${item.slug as string}`} key={item.id}>
          <ScreeningsListItem screening={item} activeScreeningSery={activeScreeningSery}/>
        </Link>
      ))}
    </div>
  ) : (
    <div className={classes.empty}>{t('No upcoming screenings.')}</div>
  );
};

export default ScreeningsList;