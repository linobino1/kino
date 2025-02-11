import type { CheckboxField, FieldHook, TextField } from 'payload'

import { formatSlugHook } from './hook'
import { formatSlug } from '@app/util/formatSlug'
import type { SlugGenerator } from './types'

type Overrides = {
  slugOverrides?: Partial<TextField>
  checkboxOverrides?: Partial<CheckboxField>
  generator?: FieldHook
}

type Slug = (fieldToUse?: string, overrides?: Overrides) => [TextField, CheckboxField]

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) => {
  const { slugOverrides, checkboxOverrides, generator } = overrides

  const defaultGenerator: SlugGenerator = async ({ value }) => formatSlug(value)

  const checkBoxField: CheckboxField = {
    name: 'slugLock',
    type: 'checkbox',
    defaultValue: () => true,
    admin: {
      hidden: true,
      position: 'sidebar',
    },
    ...checkboxOverrides,
  }

  // @ts-expect-error typescript mismatching Partial<TextField> with TextField
  const slugField: TextField = {
    name: 'slug',
    type: 'text',
    index: true,
    label: 'Slug',
    ...(slugOverrides || {}),
    hooks: {
      // Kept this in for hook or API based updates
      beforeValidate: [formatSlugHook(fieldToUse, generator ?? defaultGenerator)],
    },
    admin: {
      position: 'sidebar',
      ...(slugOverrides?.admin || {}),
      components: {
        Field: {
          path: '/components/SlugComponent#SlugComponent',
          clientProps: {
            fieldToUse,
            checkboxFieldPath: checkBoxField.name,
            // don't display live changes if there is a custom generator - we cannot pass the generator to the client
            disableLiveEdit: !!generator,
          },
        },
      },
    },
  }

  return [slugField, checkBoxField]
}
