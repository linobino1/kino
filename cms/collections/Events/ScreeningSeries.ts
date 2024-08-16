import type { CollectionConfig } from "payload/types";
import { t } from "../../i18n";
import pageLayout from "../../fields/pageLayout";

const ScreeningSeries: CollectionConfig = {
  slug: "screeningSeries",
  labels: {
    singular: t("Screening Series singular"),
    plural: t("Screening Series"),
  },
  admin: {
    group: t("Calendar"),
    useAsTitle: "name",
    defaultColumns: ["name"],
  },
  access: {
    read: () => true,
  },
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/screening-series/${slug || ""}`,
    },
    addSlugField: {
      from: "name",
    },
  },
  fields: [
    {
      name: "name",
      label: t("Name"),
      type: "text",
      localized: true,
      required: true,
    },
    pageLayout({
      defaultLayout: [
        {
          blockType: "headerImage",
        },
        {
          blockType: "heading",
        },
        {
          blockType: "content",
        },
        {
          blockType: "outlet",
        },
      ],
    }),
  ],
};

export default ScreeningSeries;
