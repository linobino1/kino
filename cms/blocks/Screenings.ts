import type { Block } from "payload/types";
import { t } from "../i18n";

export const Screenings: Block = {
  slug: "screenings",
  labels: {
    singular: t("Screenings"),
    plural: t("Screenings"),
  },
  fields: [
    {
      name: "type",
      type: "radio",
      options: [
        {
          label: t("populateManually"),
          value: "manual",
        },
        {
          label: t("byScreeningSeries"),
          value: "screeningSeries",
        },
      ],
    },
    {
      name: "screenings",
      type: "array",
      labels: {
        singular: t("Screening"),
        plural: t("Screenings"),
      },
      minRows: 1,
      fields: [
        {
          name: "doc",
          type: "relationship",
          relationTo: "screenings",
          required: true,
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData.type === "manual",
      },
    },
    {
      name: "screeningSeries",
      type: "relationship",
      relationTo: "screeningSeries",
      hasMany: false,
      admin: {
        condition: (_, siblingData) => siblingData.type === "screeningSeries",
      },
    },
  ],
};

export default Screenings;
