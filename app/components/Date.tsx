import React from 'react';
import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { enUS, de } from 'date-fns/locale';
import environment from '~/util/environment';
import { useLocale } from 'remix-i18next';

type Props = {
  iso: string
  format?: string
  className?: string
};

const tz = environment().TIMEZONE;

export const Date: React.FC<Props> = ({
  iso, className, format,
}) => {
  const date = parseISO(iso);
  const locale = useLocale() === 'de' ? de : enUS;
  if (!date || isNaN(date.getMilliseconds())) {
    console.log('encountered invalid date', iso)
    return (<></>);
  }
  const str = formatInTimeZone(date, tz, format ?? 'LLLL d, yyyy', {
    locale,
  });

  return (
    <time
      suppressHydrationWarning
      className={className}
      dateTime={iso}
    >
      {str}
    </time>
  );
};

export default Date;
