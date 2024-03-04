import type { CollectionConfig } from "payload/types";
import { t } from "../i18n";
import path from "path";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: t("Media file"),
    plural: t("Media"),
  },
  admin: {
    group: t("Media"),
    pagination: {
      defaultLimit: 100,
      limits: [50, 100, 250, 500],
    },
    enableRichTextLink: true,
    enableRichTextRelationship: true,
  },
  access: {
    read: (): boolean => true, // Everyone can read Media
  },
  upload: {
    staticDir: path.resolve(__dirname, "../../media"),
    mimeTypes: ["image/*", "application/pdf"],
  },
  fields: [
    {
      name: "alt",
      label: "Alt Text",
      type: "text",
      admin: {
        description: t("Leave empty to use the filename as alt text"),
      },
      hooks: {
        beforeValidate: [
          // use filename as alt text if alt text is empty
          ({ value, data }) => {
            if (typeof value === "string" && value.length > 0) {
              return value;
            }
            if (typeof data?.filename === "string") {
              return data.filename.split(".")[0];
            }
            return value;
          },
        ],
      },
    },
    {
      name: "tmdbFilepath",
      type: "text",
      label: t("TMDB Filepath"),
      required: false,
      unique: false,
      admin: {
        readOnly: true,
      },
    },
  ],
};

export default Media;
