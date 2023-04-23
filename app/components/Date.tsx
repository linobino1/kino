import React from 'react';
import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

type Props = {
  iso: string
  format?: string
  className?: string
};

// const tz = process.env.TIMEZONE || 'UTC';
const tz = 'UTC';

export const Date: React.FC<Props> = ({
  iso, className, format,
}) => {
  const date = parseISO(iso);
  if (!date || isNaN(date.getMilliseconds())) {
    console.log('encountered invalid date', iso)
    return (<></>);
  }
  const str = formatInTimeZone(date, tz, format ?? 'LLLL d, yyyy')

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
