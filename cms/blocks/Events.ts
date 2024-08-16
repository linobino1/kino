import type { Block } from "payload/types";
import { t } from "../i18n";

export const Events: Block = {
  slug: "events",
  labels: {
    singular: t("Event"),
    plural: t("Events"),
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
      name: "events",
      type: "array",
      labels: {
        singular: t("Event"),
        plural: t("Events"),
      },
      minRows: 1,
      fields: [
        {
          name: "doc",
          type: "relationship",
          relationTo: "events",
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

export default Events;
