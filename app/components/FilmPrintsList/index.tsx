import { FilmPrintsListItem } from './item';
import { Link } from '@remix-run/react';
import type { FilmPrint } from 'payload/generated-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import classes from './index.module.css';

export type Props = {
  from?: string
  items: FilmPrint[]
  className?: string
}

export const FilmPrintsList: React.FC<Props> = ({
  items, className,
}) => {
  const { t } = useTranslation(); 

  return items?.length ? (
    <div className={`${classes.list} ${className || ''}`}>
      {items.map((item) => (
        <Link to={`${item.slug as string}`} key={item.id}>
          <FilmPrintsListItem item={item} />
        </Link>
      ))}
    </div>
  ) : (
    <div className={classes.empty}>{t('No upcoming screenings.')}</div>
  );
};

export default FilmPrintsList;