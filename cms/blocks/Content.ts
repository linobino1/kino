import type { Block } from "payload/types";

export const Content: Block = {
  slug: 'content',
  fields: [
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
  ],
}

export default Content;