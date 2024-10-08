import { t } from "../../i18n";
import type { CollectionConfig } from "payload/types";
import HtmlField from "./fields/HtmlField";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { isAdminOrEditor } from "../../access";
import { colorPickerField } from "@innovixx/payload-color-picker-field";
import { generateHTML } from "./hooks/generateHTML";
import HowTo from "./components/HowTo";
import { MovieBlock } from "./lexical/blocks/MovieBlock";
import { EventBlock } from "./lexical/blocks/EventBlock";
import { FilmPrintBlock } from "./lexical/blocks/FilmPrintBlock";

export const Mailings: CollectionConfig = {
  slug: "mailings",
  admin: {
    group: t("Mailings"),
    defaultColumns: ["id", "updatedAt"],
    components: {
      BeforeList: [HowTo],
    },
    useAsTitle: "subject",
  },
  defaultSort: "-updatedAt",
  access: {
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "subject",
      type: "text",
      label: t("Subject"),
      required: true,
    },
    {
      type: "row",
      fields: [
        colorPickerField({
          name: "color",
          label: t("Color"),
          defaultValue: "#000000",
        }),
        {
          name: "language",
          label: t("Language"),
          type: "radio",
          options: [
            { value: "en", label: "English" },
            { value: "de", label: "Deutsch" },
          ],
          defaultValue: "de",
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      type: "group",
      name: "header",
      label: t("Header"),
      fields: [
        {
          name: "image",
          label: t("Image"),
          type: "upload",
          relationTo: "media",
        },
        {
          name: "overlay",
          label: t("Overlay"),
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    {
      name: "content",
      label: t("Content"),
      type: "richText",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [EventBlock, FilmPrintBlock, MovieBlock],
          }),
        ],
      }),
    },
    {
      type: "group",
      name: "footer",
      label: t("Footer"),
      fields: [
        {
          name: "image",
          label: t("Image"),
          type: "upload",
          relationTo: "media",
        },
        {
          name: "label",
          label: t("Label"),
          type: "text",
        },
        {
          name: "link",
          type: "text",
        },
      ],
    },
    {
      name: "html",
      type: "textarea",
      hooks: {
        beforeChange: [generateHTML],
      },
      validate: () => true, // by default has a 40k char limit
      admin: {
        components: {
          Field: HtmlField,
        },
      },
    },
  ],
};
