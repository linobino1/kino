import type { CollectionConfig } from 'payload/types';
import type { FieldHookArgs } from 'payload/dist/fields/config/types';
import { t } from '../../i18n';

const Seasons: CollectionConfig = {
  slug: 'seasons',
  labels: {
    singular: t('Season'),
    plural: t('Seasons'),
  },
  admin: {
    group: t('Configuration'),
    useAsTitle: 'name',
  },
  defaultSort: '-sort',
  access: {
    read: () => true,
  },
  custom: {
    addSlugField: {
      from: 'name',
    },
    addUrlField: {
      hook: (slug?: string) => `/seasons/${slug || ''}`,
    },
  },
  fields: [
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'header',
      label: t('Header'),
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    // HACK: order the seasons by their name
    // a season is typically called "Summer term 2021" or "Winter term 2021/22"
    // so we can sort by the numbers in the name and then by the name itself
    // -> the sort field returns "2021Summer term 2021" or "202122Winter term 2021/22
    {
      name: 'sort',
      type: 'text',
      hidden: true,
      hooks: {
        beforeValidate: [
          ({ siblingData }: FieldHookArgs) => {
            if (!siblingData || !(typeof siblingData.name === 'string')) return;
            // get numbers from name
            const numbers = siblingData.name.match(/\d+/g)?.join('') || '';
            return numbers + siblingData.name;
          },
        ],
      }
    },
  ],
};

export default Seasons;
