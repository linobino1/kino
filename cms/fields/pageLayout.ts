import type { Field } from 'payload/types';
import { Content } from '../blocks/Content';
import { Image } from '../blocks/Image';
import { HeaderImage } from '../blocks/HeaderImage';
import { Outlet } from '../blocks/Outlet';
import { t } from '../i18n';

export const pageLayout = (): Field => ({
  name: 'layout',
  label: t('Layout'),
  type: 'blocks',
  minRows: 1,
  blocks: [
    Content,
    Image,
    HeaderImage,
    Outlet,
  ],
});

export default pageLayout;
