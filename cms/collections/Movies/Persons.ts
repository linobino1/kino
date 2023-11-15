import type { CollectionConfig } from "payload/types";
import { t } from "../../i18n";

const Persons: CollectionConfig = {
  slug: "persons",
  labels: {
    singular: t("Person"),
    plural: t("Persons"),
  },
  admin: {
    group: t("Configuration"),
    defaultColumns: ["name"],
    useAsTitle: "name",
  },
  access: {
    read: () => true,
  },
  custom: {
    addSlugField: {
      from: "name",
    },
  },
  fields: [
    {
      name: "name",
      label: t("Name"),
      type: "text",
      required: true,
      unique: true,
    },
  ],
};

export default Persons;
