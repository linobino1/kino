import type { Block } from "payload/types";
import { t } from "../i18n";

/**
 * This is a placeholder block that can be used to add a custom block to a page.
 * The react 'Blocks' component will render its children in the place of this block.
 */
export const Outlet: Block = {
  slug: "outlet",
  labels: {
    singular: t("Outlet"),
    plural: t("Outlets"),
  },
  fields: [],
};

export default Outlet;
