import type { Field } from 'payload'
import type { StaticPage } from '@/payload-types'
import { Content } from '../blocks/Content'
import { HeaderImage } from '../blocks/HeaderImage'
import { Outlet } from '../blocks/Outlet'
import { Heading } from '../blocks/Heading'
import { Image } from '../blocks/Image'
import { Gallery } from '../blocks/Gallery'
import { Video } from '../blocks/Video'
import { RawHTML } from '../blocks/RawHTML'
import Events from '../blocks/Events'

export type PageLayout = StaticPage['layout']

export type Props = {
  defaultLayout?: any
}

export const pageLayout = (props?: Props): Field => {
  const { defaultLayout } = props || {}
  return {
    name: 'layout',
    label: 'Layout',
    type: 'group',
    fields: [
      {
        name: 'blocks',
        label: 'Blöcke',
        type: 'blocks',
        required: true,
        minRows: 1,
        blocks: [Heading, HeaderImage, Content, Outlet, Image, Gallery, Video, Events, RawHTML],
        defaultValue: defaultLayout,
      },
      {
        name: 'type',
        label: 'Art',
        type: 'select',
        defaultValue: 'default',
        required: true,
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Info', value: 'info' },
        ],
      },
    ],
  }
}

export default pageLayout
