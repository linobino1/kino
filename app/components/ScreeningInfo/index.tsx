import type { Screening } from 'payload/generated-types';
import React from 'react';
// import { useTranslation } from 'react-i18next';
import classes from './index.module.css';

export interface Props extends React.HTMLAttributes<HTMLElement> {
  screening: Screening
}

export const ScreeningInfo: React.FC<Props> = (props) => {
  const { screening } = props;
  // const { t } = useTranslation();
  return (
    <div {...props}>
      {screening.info && (
        <p
          className={classes.info}
          dangerouslySetInnerHTML={{
            __html: screening.info as string
          }}
        />
      )}
      {/* { screening.guest && (
        <p className={classes.discussion}>
          { t('Film talk with {{guests}} moderated by {{moderator}}', {
            guests: screening.guest,
            moderator: screening.moderator,
          })}
        </p>
      )} */}
    </div>
  )
};

export default ScreeningInfo;