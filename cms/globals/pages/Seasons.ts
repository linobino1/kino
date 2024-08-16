import type { GlobalConfig } from "payload/types";
import { t } from "../../i18n";
import { metaField } from "../../fields/meta";
import pageLayout from "../../fields/pageLayout";

export const SeasonsPage: GlobalConfig = {
  slug: "seasonsPage",
  admin: {
    group: t("Pages"),
    description: t("AdminExplainEventsPage"),
  },
  label: t("Seasons"),
  fields: [pageLayout(), metaField(t("Meta"))],
};

export default SeasonsPage;
