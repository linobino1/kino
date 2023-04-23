import React from 'react';
import { Link, useMatches } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import classes from './index.module.css';

export const UserStatus: React.FC = () => {
  const { t } = useTranslation();
  const user = useMatches().find((x) => x.id === 'root')?.data.user;

  return (
    <div className={classes.userStatus}>
      { user ? (
        <Link to="/auth/me" className={classes.name}>{user.name}</Link>
      ) : (
        <Link to="/auth/signin" className={classes.signIn}>
          {t('Sign In')}
        </Link>
      )}
    </div>
  );
};
