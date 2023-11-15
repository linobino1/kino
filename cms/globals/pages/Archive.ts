import type { GlobalConfig } from "payload/types";
import { t } from "../../i18n";
import { metaField } from "../../fields/meta";
import pageLayout from "../../fields/pageLayout";

export const Archive: GlobalConfig = {
  slug: "archive",
  admin: {
    group: t("Pages"),
  },
  label: t("Film Archive"),
  fields: [pageLayout(), metaField(t("Meta"))],
};

export default Archive;
