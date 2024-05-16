import type { Field } from "payload/types";
import type { StaticPage } from "payload/generated-types";
import { Content } from "../blocks/Content";
import { HeaderImage } from "../blocks/HeaderImage";
import { Outlet } from "../blocks/Outlet";
import { Heading } from "../blocks/Heading";
import { Image } from "../blocks/Image";
import { Gallery } from "../blocks/Gallery";
import { Video } from "../blocks/Video";
import { t } from "../i18n";
import Screenings from "../blocks/Screenings";

export type PageLayout = StaticPage["layout"];

export type Props = {
  defaultLayout?: any;
};

export const pageLayout = (props?: Props): Field => {
  const { defaultLayout } = props || {};
  return {
    name: "layout",
    label: t("Layout"),
    type: "group",
    fields: [
      {
        name: "blocks",
        label: t("Blocks"),
        type: "blocks",
        required: true,
        minRows: 1,
        blocks: [
          Heading,
          HeaderImage,
          Content,
          Outlet,
          Image,
          Gallery,
          Video,
          Screenings,
        ],
        defaultValue: defaultLayout,
      },
      {
        name: "type",
        label: t("Layout Type"),
        type: "select",
        defaultValue: "default",
        required: true,
        options: [
          { label: t("Default"), value: "default" },
          { label: t("Info"), value: "info" },
        ],
      },
    ],
  };
};

export default pageLayout;
