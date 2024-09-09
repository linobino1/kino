import type { CollectionConfig, FieldBase } from "payload/types";
import type { Movie } from "payload/generated-types";
import { t } from "../../i18n";
import { getDefaultDocId } from "../../fields/default";
import { MigrateMovieButton } from "../../MigrateMovie/admin/Button";
import { isAdminOrEditor } from "../../access";
import { slugGenerator } from "./util/slugGenerator";
import { updateImages } from "./hooks/updateImages";

const requiredForNonScreeningEvents: FieldBase["validate"] = (
  value: string,
  { data, t }
) => {
  if (data?.type !== "screening" && !value)
    return t("Field is required for non-screening events");
  return true;
};

const Events: CollectionConfig = {
  slug: "events",
  labels: {
    singular: t("Event"),
    plural: t("Events"),
  },
  admin: {
    group: t("Calendar"),
    defaultColumns: ["date", "title", "_status"],
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
  },
  access: {
    read: (args) => {
      if (isAdminOrEditor(args)) return true;
      return {
        _status: {
          equals: "published",
        },
      };
    },
  },
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/events/${slug || ""}`,
    },
    addSlugField: {
      generator: slugGenerator,
    },
  },
  hooks: {
    beforeChange: [updateImages],
  },
  fields: [
    {
      name: "type",
      label: t("Type"),
      type: "select",
      options: [
        { label: t("Screening"), value: "screening" },
        { label: t("Event"), value: "event" },
      ],
      defaultValue: "screening",
    },
    {
      name: "title",
      label: t("Title"),
      type: "text",
      localized: true,
      admin: {
        description: t(
          "Leave blank to use the title of the first feature film, if this is a screening"
        ),
      },
      validate: requiredForNonScreeningEvents,
      hooks: {
        beforeChange: [
          // if the field is empty, we will fill it with the title of the first film
          async ({ data, value, req }) => {
            if (value) return value;
            if (!data?.films?.length) return undefined;
            const filmPrint = await req.payload.findByID({
              collection: "filmPrints",
              id: data.films[0].filmprint,
              locale: req.locale,
              depth: 4,
            });
            return (filmPrint?.movie as Movie)?.title;
          },
        ],
      },
    },
    {
      name: "subtitle",
      label: t("Subtitle"),
      type: "text",
      localized: true,
      admin: {
        condition: (data) => data?.type !== "screening",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "date",
          label: t("Date & Time"),
          type: "date",
          required: true,
          defaultValue: () => {
            const res = new Date();
            res.setHours(19, 0, 0, 0);
            return res.toISOString();
          },
          admin: {
            date: {
              pickerAppearance: "dayAndTime",
            },
            description: t("adminWarningTimezone"),
            width: "50%",
          },
        },
        {
          name: "location",
          label: t("Location"),
          type: "relationship",
          relationTo: "locations",
          defaultValue: () => getDefaultDocId("locations"),
          admin: {
            width: "50%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "season",
          label: t("Season"),
          type: "relationship",
          relationTo: "seasons",
          hasMany: false,
          required: true,
          defaultValue: () =>
            fetch(`/api/seasons/`)
              .then((res) => res.json())
              .then((res) => res.docs[0].id)
              .catch(() => null),
          admin: {
            width: "50%",
          },
        },
        {
          name: "series",
          label: t("Screening Series singular"),
          type: "relationship",
          relationTo: "screeningSeries",
          hasMany: false,
          admin: {
            width: "50%",
          },
        },
      ],
    },
    {
      name: "header",
      label: t("Header Image"),
      type: "upload",
      relationTo: "media",
      admin: {
        condition: (data) => data?.type !== "screening",
      },
      validate: requiredForNonScreeningEvents,
    },
    {
      name: "poster",
      label: t("Poster"),
      type: "upload",
      relationTo: "media",
      admin: {
        condition: (data) => data?.type !== "screening",
      },
      validate: requiredForNonScreeningEvents,
    },
    {
      name: "info",
      label: t("Info"),
      type: "richText",
      admin: {
        description: t("AdminExplainScreeningInfo"),
      },
      localized: true,
      required: false,
      validate: requiredForNonScreeningEvents,
    },
    {
      name: "films",
      label: t("Films"),
      type: "array",
      minRows: 1,
      required: true,
      fields: [
        {
          name: "migrateMovie",
          type: "ui",
          admin: {
            components: {
              Field: () => MigrateMovieButton({ newTab: true }),
            },
          },
        },
        {
          name: "filmprint",
          label: t("Film"),
          type: "relationship",
          relationTo: "filmPrints",
          required: true,
          filterOptions: {
            _status: {
              equals: "published",
            },
          },
        },
        {
          name: "isSupportingFilm",
          label: t("Is Supporting Film"),
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "info",
          label: t("Info"),
          type: "richText",
          localized: true,
          required: false,
          admin: {
            description: t("AdminExplainFilmInfo"),
          },
        },
      ],
      admin: {
        condition: (data) => data?.type === "screening",
      },
    },
    {
      name: "moderator",
      label: t("Moderator"),
      type: "text",
      required: false,
    },
    {
      name: "guest",
      label: t("Guest"),
      type: "text",
      required: false,
    },
    {
      name: "excludeFromUpcoming",
      label: t("excludeFromUpcomingScreenings"),
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: t("excludeFromUpcomingScreeningsDescription"),
      },
    },
  ],
};

export default Events;
