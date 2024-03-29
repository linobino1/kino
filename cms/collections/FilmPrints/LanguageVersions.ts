import type { CollectionConfig } from "payload/types";
import { t } from "../../i18n";

const LanguageVersions: CollectionConfig = {
  slug: "languageVersions",
  labels: {
    singular: t("Language Version"),
    plural: t("Language Versions"),
  },
  admin: {
    group: t("Configuration"),
    defaultColumns: ["abbreviation", "name"],
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
    {
      name: "abbreviation",
      label: t("Abbreviation"),
      type: "text",
      localized: true,
      required: true,
    },
  ],
};

export default LanguageVersions;
