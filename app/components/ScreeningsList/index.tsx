import { ScreeningsListItem } from './item';
import { Link } from '@remix-run/react';
import type { Screening, ScreeningSery, Site } from 'payload/generated-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import classes from './index.module.css';
import { JsonLd, screeningsListMarkup } from 'cms/schemaorg';

export type Props = {
  from?: string
  items: Screening[]
  site: Site
  className?: string
  activeScreeningSery?: ScreeningSery
  emptyMessage?: string
}

export const ScreeningsList: React.FC<Props> = ({
  items, className, activeScreeningSery, emptyMessage, site,
}) => {
  const { t } = useTranslation(); 

  return items?.length ? (
    <div className={`${classes.list} ${className || ''}`}>
      { JsonLd(screeningsListMarkup(items, site)) }
      {items.map((item) => (
        <Link
          key={item.id}
          to={`/screenings/${item.slug as string}`}
          prefetch='intent'
        >
          <ScreeningsListItem
            screening={item}
            activeScreeningSery={activeScreeningSery}
            site={site}
          />
        </Link>
      ))}
    </div>
  ) : (
    <div className={classes.empty}>
      { emptyMessage || t('No upcoming screenings.') }
    </div>
  );
};

export default ScreeningsList;