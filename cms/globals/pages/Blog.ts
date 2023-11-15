import type { GlobalConfig } from "payload/types";
import { t } from "../../i18n";
import { metaField } from "../../fields/meta";
import pageLayout from "../../fields/pageLayout";

export const Blog: GlobalConfig = {
  slug: "blog",
  admin: {
    group: t("Pages"),
  },
  label: t("Blog"),
  fields: [pageLayout(), metaField(t("Meta"))],
};

export default Blog;
