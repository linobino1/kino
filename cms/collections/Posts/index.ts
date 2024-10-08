import type { CollectionConfig } from "payload/types";
import { t } from "../../i18n";
import { Content } from "../../blocks/Content";
import { Image } from "../../blocks/Image";
import { Gallery } from "../../blocks/Gallery";
import { Video } from "../..//blocks/Video";
import { LinkableCollectionSlugs } from "../../types";

const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    group: t("Blog"),
    defaultColumns: ["date", "title"],
    useAsTitle: "title",
  },
  defaultSort: "-date",
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/news/${slug || ""}`,
    },
    addSlugField: {
      from: "title",
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "date",
      type: "date",
      required: true,
      defaultValue: Date(),
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "dd.MM.yyyy",
        },
      },
    },
    {
      name: "header",
      label: t("Header Image"),
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "content",
      label: t("Preview"),
      type: "richText",
      localized: true,
      required: true,
    },
    {
      name: "details",
      label: t("Detail"),
      type: "blocks",
      blocks: [Content, Image, Gallery, Video],
      admin: {
        description: t("Add a detail page for the post"),
      },
    },
    {
      type: "group",
      label: t("Link"),
      name: "link",
      admin: {
        description: t("Add a link to the post header."),
      },
      fields: [
        {
          name: "type",
          label: t("Type"),
          type: "radio",
          defaultValue: "none",
          admin: {
            description: t("AdminExplainPostLinkType"),
          },
          options: [
            {
              label: t("None"),
              value: "none",
            },
            {
              label: t("Internal Link"),
              value: "internal",
            },
            {
              label: t("External Link"),
              value: "external",
            },
          ],
        },
        // internal link
        {
          name: "doc",
          type: "relationship",
          relationTo: LinkableCollectionSlugs,
          required: true,
          admin: {
            condition: (siblingData) => siblingData.link?.type === "internal",
          },
        },
        // external link
        {
          name: "url",
          type: "text",
          required: true,
          admin: {
            condition: (siblingData) => siblingData.link?.type === "external",
          },
        },
      ],
    },
  ],
};

export default Posts;
