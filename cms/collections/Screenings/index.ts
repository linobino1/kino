import type { CollectionConfig } from "payload/types";
import type { Movie } from "payload/generated-types";
import type { slugGeneratorArgs } from "../../plugins/addSlugField";
import { t } from "../../i18n";
import { getDefaultDocId } from "../../fields/default";
import { MigrateMovieButton } from "../../MigrateMovie/admin/Button";
import { isAdminOrEditor } from "../../access";

const Screenings: CollectionConfig = {
  slug: "screenings",
  labels: {
    singular: t("Screening"),
    plural: t("Screenings"),
  },
  admin: {
    group: t("Screenings"),
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
      hook: (slug?: string) => `/screenings/${slug || ""}`,
    },
    addSlugField: {
      generator: async ({
        data,
        req,
        originalDoc,
        from,
      }: slugGeneratorArgs) => {
        // we need the date and at least one film
        if (
          !data ||
          !("date" in data) ||
          !("films" in data) ||
          !data.films.length ||
          !("filmprint" in data.films[0])
        ) {
          return undefined;
        }

        // date is an ISO string, let's just use the first 10 characters (YYYY-MM-DD)
        const date = data.date.substr(0, 10);

        // movie is just an id
        const filmPrint = await req.payload.findByID({
          collection: "filmPrints",
          id: data.films[0].filmprint,
          locale: req.payload.config.i18n.fallbackLng as string,
          depth: 2,
        });

        // if we cannot find the movie title we abort
        if (!filmPrint || !filmPrint.movie) return undefined;

        // e.g. My Movie-2021-01-01-
        return `${(filmPrint.movie as Movie)?.internationalTitle}-${date}`;
      },
    },
  },
  fields: [
    {
      name: "migrateMovie",
      type: "ui",
      admin: {
        condition: (data) => !data?.films?.length,
        components: {
          Field: MigrateMovieButton,
        },
      },
    },
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
      },
    },
    {
      name: "title",
      label: t("Title"),
      type: "text",
      localized: true,
      admin: {
        description: t(
          "Leave blank to use the title of the first feature film"
        ),
      },
      hooks: {
        // compute title
        afterRead: [
          async ({ data, value, req }) => {
            if (value) return value;

            // return the title of the first film
            if (!data?.films?.length) return undefined;
            const filmPrint = await req.payload.findByID({
              collection: "filmPrints",
              id: data.films[0].filmprint,
              locale: req.locale,
              depth: 4,
            });
            return (filmPrint?.movie as Movie).title;
          },
        ],
        beforeChange: [
          // if the title equals the title of the first film, don't save it
          async ({ data, value, req }) => {
            // we need a film to compare to
            if (!data?.films?.length) return value;
            const filmPrint = await req.payload.findByID({
              collection: "filmPrints",
              id: data.films[0].filmprint,
              locale: req.locale,
              depth: 4,
            });

            if (value === (filmPrint?.movie as Movie).title) return null;
            return value;
          },
        ],
      },
    },
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
    },
    {
      name: "location",
      label: t("Location"),
      type: "relationship",
      relationTo: "locations",
      defaultValue: () => getDefaultDocId("locations"),
    },
    {
      name: "series",
      label: t("Screening Series"),
      type: "relationship",
      relationTo: "screeningSeries",
      hasMany: false,
    },
    {
      name: "films",
      label: t("Films"),
      type: "array",
      minRows: 1,
      required: true,
      fields: [
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
        },
      ],
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

export default Screenings;
