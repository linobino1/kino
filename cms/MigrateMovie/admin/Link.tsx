import React from 'react';
import { useConfig } from "payload/components/utilities";
import { useTranslation } from 'react-i18next';

export const MigrateMovieLink: React.FC = () => {
  const { routes: { admin: adminRoute } } = useConfig();
  const path = `${adminRoute}/migrate-movie`
  const { t } = useTranslation('backend')

  return (
    <a
      href={path}
    >
      { t('Migrate Movie') }
    </a>
  );
};

export default MigrateMovieLink;
