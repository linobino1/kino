import { t } from "../../i18n";
import type { CollectionConfig } from "payload/types";
import HtmlField from "./fields/HtmlField";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { isAdminOrEditor } from "../../access";
import { colorPickerField } from "@innovixx/payload-color-picker-field";
import { generateHTML } from "./hooks/generateHTML";
import HowTo from "./components/HowTo";

export const Mailings: CollectionConfig = {
  slug: "mailings",
  admin: {
    group: t("Mailings"),
    defaultColumns: ["id", "updatedAt"],
    components: {
      BeforeList: [HowTo],
    },
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
      name: "headerImage",
      label: t("Header Image"),
      type: "upload",
      relationTo: "media",
    },
    {
      name: "content",
      label: t("Content"),
      type: "richText",
      editor: lexicalEditor({}),
    },
    {
      name: "screenings",
      label: t("Screenings"),
      type: "array",
      fields: [
        {
          name: "screening",
          type: "relationship",
          relationTo: "screenings",
        },
        {
          name: "additionalText",
          type: "richText",
          editor: lexicalEditor({}),
        },
      ],
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
      type: "text",
      hooks: {
        beforeChange: [generateHTML],
      },
      admin: {
        components: {
          Field: HtmlField,
        },
      },
    },
  ],
};
