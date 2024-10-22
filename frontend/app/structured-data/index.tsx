import React from "react";
import type { Thing, WithContext, ItemList } from "schema-dts";

export function addContext<T extends Thing>(json: T): WithContext<T> {
  const jsonWithContext = json as WithContext<T>;
  jsonWithContext["@context"] = "https://schema.org";
  return jsonWithContext;
}

export function JsonLd<T extends Thing>(data: T): React.ReactNode {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(addContext(data)) }}
    />
  );
}

export function itemList(items: Thing[]): ItemList {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item,
    })),
  };
}
