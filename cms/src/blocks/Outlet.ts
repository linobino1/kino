import type { Block } from 'payload'

/**
 * This is a placeholder block that can be used to add a custom block to a page.
 * The react 'Blocks' component will render its children in the place of this block.
 */
export const Outlet: Block = {
  slug: 'outlet',
  labels: {
    singular: 'Outlet',
    plural: 'Outlets',
  },
  fields: [],
}

export default Outlet
