import type { CollectionConfig } from "payload/types";
import { t } from "../../i18n";

const Colors: CollectionConfig = {
  slug: "colors",
  labels: {
    singular: t("Color"),
    plural: t("Colors"),
  },
  admin: {
    group: t("Configuration"),
    defaultColumns: ["type", "name"],
    useAsTitle: "name",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      label: t("Name"),
      type: "text",
      localized: true,
      required: true,
    },
  ],
};

export default Colors;
