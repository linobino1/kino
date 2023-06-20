import type { GlobalConfig } from 'payload/types';
import { t } from '../../i18n';
import { metaField } from '../../fields/meta';
import pageLayout from '../../fields/pageLayout';

export const ScreeningsPage: GlobalConfig = {
  slug: 'screeningsPage',
  admin: {
    group: t('Pages'),
    description: t('AdminExplainScreeningsPage'),
  },
  label: t('Screenings'),
  fields: [
    pageLayout(),
    metaField(t('Meta')),
  ],
};

export default ScreeningsPage;
