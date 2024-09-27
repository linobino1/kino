import type { Block } from "payload/types";
import { t } from "../i18n";

export const RawHTML: Block = {
  slug: "rawHTML",
  labels: {
    singular: t("HTML"),
    plural: t("HTML"),
  },
  fields: [
    {
      name: "html",
      label: t("Content"),
      type: "code",
      required: true,
    },
  ],
};

export default RawHTML;
