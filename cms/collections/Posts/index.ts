import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';
import { Content } from '../../blocks/Content';
import { Gallery } from '../../blocks/Gallery';
import { Video } from '../..//blocks/Video';
import video from '../../fields/richtext/video';
import { urlField, LinkableCollectionSlugs } from '../../fields/url';

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: t('Blog'),
    defaultColumns: ['date', 'title'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField('title'),
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: Date(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'header',
      label: t('Header Image'),
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      label: t('Content'),
      type: 'richText',
      localized: true,
      required: true,
      admin: {
        elements: [
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'link',
          'ol',
          'ul',
          'indent',
          'upload',
          video,
        ],
        leaves: ['bold', 'italic', 'underline', 'strikethrough'],
      },
    },
    {
      name: 'details',
      label: t('Detail'),
      type: 'blocks',
      localized: true,
      blocks: [
        Content,
        Gallery,
        Video,
      ],
      admin: {
        description: t('Add a detail page for the post'),
      },
    },
    {
      type: 'group',
      label: t('Link'),
      name: 'link',
      admin: {
        description: t('Add a link to the post header.'),
      },
      fields: [
        {
          name: 'type',
          label: t('Type'),
          type: 'radio',
          defaultValue: 'self',
          admin: {
            description: t( 'AdminExplainPostLinkType'),
          },
          options: [
            {
              label: t('None'),
              value: 'none',
            },
            {
              label: t('Internal Link'),
              value: 'internal',
            },
            {
              label: t('External Link'),
              value: 'external',
            },
          ],
        },
        // internal link
        {
          name: 'doc',
          type: 'relationship',
          relationTo: LinkableCollectionSlugs,
          required: true,
          admin: {
            condition: (siblingData) => siblingData.link?.type === 'internal',
          },
        },
        // external link
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            condition: (siblingData) => siblingData.link?.type === 'external',
          },
        },
      ],
    },
    urlField(({ data }) => `/news/${data?.slug}`),
  ],
};

export default Posts;
