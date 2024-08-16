import type { GlobalConfig } from "payload/types";
import { t } from "../../i18n";
import { metaField } from "../../fields/meta";
import pageLayout from "../../fields/pageLayout";

export const EventsPage: GlobalConfig = {
  slug: "eventsPage",
  admin: {
    group: t("Pages"),
    description: t("AdminExplainEventsPage"),
  },
  label: t("Screenings"),
  fields: [pageLayout(), metaField(t("Meta"))],
};

export default EventsPage;
