import type { Block } from "payload/types";
import { t } from "../../../../i18n";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const EventBlock: Block = {
  slug: "eventBlock",
  fields: [
    {
      name: "event",
      type: "relationship",
      relationTo: "events",
      required: true,
      filterOptions() {
        return {
          _status: {
            equals: "published",
          },
        };
      },
    },
    {
      name: "additionalText",
      label: t("additional info"),
      type: "richText",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures,
      }),
    },
  ],
};
