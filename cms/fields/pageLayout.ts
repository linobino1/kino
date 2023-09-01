import type { Field } from 'payload/types';
import { Content } from '../blocks/Content';
import { HeaderImage } from '../blocks/HeaderImage';
import { Outlet } from '../blocks/Outlet';
import { Heading } from '../blocks/Heading';
import { t } from '../i18n';
import Gallery from '../blocks/Gallery';
import type { StaticPage } from 'payload/generated-types';

export type PageLayout = StaticPage['layout'];

export const pageLayout = (): Field => ({
  name: 'layout',
  label: t('Layout'),
  type: 'group',
  fields: [
    {
      name: 'blocks',
      label: t('Blocks'),
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: [
        Heading,
        HeaderImage,
        Content,
        Outlet,
        Gallery,
      ],
    },
    {
      name: 'type',
      label: t('Layout Type'),
      type: 'select',
      defaultValue: 'default',
      required: true,
      options: [
        { label: t('Default'), value: 'default' },
        { label: t('Info'), value: 'info' },
      ],
    },
  ],
});

export default pageLayout;
