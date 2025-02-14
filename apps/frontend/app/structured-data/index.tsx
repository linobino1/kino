import type { Thing, WithContext, ItemList } from 'schema-dts'
import type { Schema } from './types'

export const addContextToSchema = <T extends Schema>(schema: T): WithContext<T> => {
  return {
    '@context': 'https://schema.org',
    ...schema,
  }
}

export function JsonLd<T extends Thing>(schema: T): React.ReactNode {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(addContextToSchema(schema)),
      }}
    />
  )
}

export function itemList(items: Thing[]): ItemList {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item,
    })),
  }
}
