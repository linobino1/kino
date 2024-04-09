import { buildConfig } from "payload/config";
import path from "path";
import { options } from "./app/i18n";
import en from "./public/locales/en/backend.json";
import de from "./public/locales/de/backend.json";
import Media from "./cms/collections/Media";
import Navigations from "./cms/collections/Navigations";
import Pages from "./cms/collections/Pages";
import Users from "./cms/collections/Users";
import Site from "./cms/globals/Site";
import Posts from "./cms/collections/Posts";
import Blog from "./cms/globals/pages/Blog";
import Archive from "./cms/globals/pages/Archive";
import Persons from "./cms/collections/Movies/Persons";
import Jobs from "./cms/collections/Movies/Jobs";
import Companies from "./cms/collections/Movies/Companies";
import Genres from "./cms/collections/Movies/Genres";
import Movies from "./cms/collections/Movies";
import Countries from "./cms/collections/Movies/Countries";
import Screenings from "./cms/collections/Screenings";
import Seasons from "./cms/collections/Screenings/Seasons";
import ScreeningSeries from "./cms/collections/Screenings/ScreeningSeries";
import Locations from "./cms/collections/Screenings/Locations";
import FilmPrints from "./cms/collections/FilmPrints";
import AspectRatios from "./cms/collections/FilmPrints/AspectRatios";
import Carriers from "./cms/collections/FilmPrints/Carriers";
import Conditions from "./cms/collections/FilmPrints/Conditions";
import Formats from "./cms/collections/FilmPrints/Formats";
import LanguageVersions from "./cms/collections/FilmPrints/LanguageVersions";
import SoundFormats from "./cms/collections/FilmPrints/SoundFormats";
import Rentals from "./cms/collections/FilmPrints/Rentals";
import ScreeningsPage from "./cms/globals/pages/ScreeningsPage";
import Colors from "./cms/collections/FilmPrints/Colors";
import Categories from "./cms/collections/FilmPrints/Categories";
import { MigrateMovieView } from "./cms/MigrateMovie/admin/View";
import { endpoints as migrateMovieEndpoints } from "./cms/MigrateMovie/api/endpoints";
import { MigrateMovieLink } from "./cms/MigrateMovie/admin/Link";
import { MigrateMovieButton } from "./cms/MigrateMovie/admin/Button";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import { addUrlField } from "./cms/plugins/addUrlField";
import { addSlugField } from "./cms/plugins/addSlugField";
import { SeasonsPage } from "./cms/globals/pages/Seasons";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { seed } from "./cms/endpoints/seed";

const mockModulePath = path.resolve(__dirname, "mocks/emptyObject.js");

export default buildConfig({
  db: mongooseAdapter({
    url: process.env.MONGO_URL || "mongodb://localhost:27017/app",
  }),
  endpoints: [
    // path will be prefixed with /api if root is not set to true
    ...migrateMovieEndpoints,
    {
      path: "/seed",
      method: "get",
      handler: seed,
    },
  ],
  editor: slateEditor({
    admin: {
      elements: [
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "link",
        "ol",
        "ul",
        "indent",
        "upload",
      ],
      leaves: ["bold", "italic", "underline", "strikethrough"],
    },
  }),
  plugins: [
    addUrlField,
    addSlugField,
    cloudStorage({
      enabled: process.env.S3_ENABLED === "true",
      collections: {
        media: {
          disablePayloadAccessControl: true, // serve files directly from S3
          generateFileURL: (file) => {
            return `${process.env.MEDIA_URL}/${file.filename}`;
          },
          adapter: s3Adapter({
            bucket: process.env.S3_BUCKET || "",
            config: {
              endpoint: process.env.S3_ENDPOINT || undefined,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY || "",
                secretAccessKey: process.env.S3_SECRET_KEY || "",
              },
              region: process.env.S3_REGION || "",
            },
          }),
        },
      },
    }),
  ],
  rateLimit: {
    window: 5 * 60 * 1000, // 5 minutes
    max: 1000, // limit each IP to 1000 requests per window
  },
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    components: {
      beforeDashboard: [MigrateMovieButton],
      views: {
        MigrateMovieView,
      },
      beforeNavLinks: [MigrateMovieLink],
    },
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config?.resolve?.alias,
          fs: mockModulePath,
          os: mockModulePath,
        },
      },
    }),
  },
  upload: {
    defCharset: "utf8",
    defParamCharset: "utf8",
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  },
  i18n: {
    // admin panel i18n
    supportedLngs: ["en", "de"],
    fallbackLng: "en",
    ns: ["backend"],
    resources: {
      en: {
        backend: en,
      },
      de: {
        backend: de,
      },
    },
  },
  graphQL: {
    disable: true,
  },
  collections: [
    // Movie Database
    Movies,

    // Film Prints
    FilmPrints,

    // Screenings
    Screenings,
    ScreeningSeries,

    // Blog
    Posts,

    // Media
    Media,

    // Pages
    Pages,

    // Configuration
    Formats,
    AspectRatios,
    Carriers,
    LanguageVersions,
    SoundFormats,
    Conditions,
    Seasons,
    Genres,
    Locations,
    Rentals,
    Colors,
    Categories,
    Persons,
    Jobs,
    Companies,
    Countries,

    // System
    Navigations,
    Users,
  ],
  globals: [Site, Blog, ScreeningsPage, SeasonsPage, Archive],
  typescript: {
    outputFile: path.resolve(__dirname, "cms/payload-types.ts"),
  },
  // here we stay consistent with the i18n config of remix since this affects
  // the public frontend
  localization: {
    defaultLocale: options.fallbackLng,
    locales: options.supportedLngs,
    fallback: true,
  },
});
