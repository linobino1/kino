/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  collections: {
    movies: Movie;
    filmPrints: FilmPrint;
    events: Event;
    screeningSeries: ScreeningSery;
    posts: Post;
    mailings: Mailing;
    media: Media;
    staticPages: StaticPage;
    formats: Format;
    aspectRatios: AspectRatio;
    carriers: Carrier;
    languageVersions: LanguageVersion;
    soundFormats: SoundFormat;
    conditions: Condition;
    seasons: Season;
    genres: Genre;
    locations: Location;
    rentals: Rental;
    colors: Color;
    categories: Category;
    persons: Person;
    jobs: Job;
    companies: Company;
    countries: Country;
    navigations: Navigation;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  db: {
    defaultIDType: string;
  };
  globals: {
    site: Site;
    blog: Blog;
    eventsPage: EventsPage;
    seasonsPage: SeasonsPage;
    archive: Archive;
  };
  locale: 'en' | 'de';
  user: User & {
    collection: 'users';
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "movies".
 */
export interface Movie {
  id: string;
  title: string;
  internationalTitle: string;
  originalTitle: string;
  tmdbId?: number | null;
  still: string | Media;
  poster: string | Media;
  directors: (string | Person)[];
  duration: number;
  ageRating?: ('0' | '6' | '12' | '16' | '18' | '') | null;
  countries: (string | Country)[];
  year: number;
  decade: number;
  isHfgProduction?: boolean | null;
  genres: (string | Genre)[];
  synopsis: string;
  trailer?: string | null;
  cast?: (string | Person)[] | null;
  crew?:
    | {
        person: string | Person;
        job: string | Job;
        id?: string | null;
      }[]
    | null;
  productionCompanies?: (string | Company)[] | null;
  tags?: string | null;
  isMigratedFromWordpress?: boolean | null;
  wordpressMigrationNotes?: string | null;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  alt?: string | null;
  tmdbFilepath?: string | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "persons".
 */
export interface Person {
  id: string;
  name: string;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "countries".
 */
export interface Country {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "genres".
 */
export interface Genre {
  id: string;
  name: string;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "jobs".
 */
export interface Job {
  id: string;
  name: string;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "companies".
 */
export interface Company {
  id: string;
  name: string;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "filmPrints".
 */
export interface FilmPrint {
  id: string;
  title?: string | null;
  movie: string | Movie;
  type?: ('analog' | 'digital') | null;
  format: string | Format;
  languageVersion: string | LanguageVersion;
  isRented?: boolean | null;
  rental?: (string | null) | Rental;
  carrier?: (string | null) | Carrier;
  category?: (string | null) | Category;
  numActs?: number | null;
  aspectRatio?: (string | null) | AspectRatio;
  color?: (string | null) | Color;
  soundFormat?: (string | null) | SoundFormat;
  condition?: (string | null) | Condition;
  url: string;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "formats".
 */
export interface Format {
  id: string;
  type?: ('analog' | 'digital') | null;
  name: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "languageVersions".
 */
export interface LanguageVersion {
  id: string;
  name: string;
  abbreviation: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "rentals".
 */
export interface Rental {
  id: string;
  name: string;
  logo?: (string | null) | Media;
  credits: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "carriers".
 */
export interface Carrier {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories".
 */
export interface Category {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "aspectRatios".
 */
export interface AspectRatio {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "colors".
 */
export interface Color {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "soundFormats".
 */
export interface SoundFormat {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "conditions".
 */
export interface Condition {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "events".
 */
export interface Event {
  id: string;
  type?: ('screening' | 'event') | null;
  title?: string | null;
  subtitle?: string | null;
  date: string;
  location?: (string | null) | Location;
  season: string | Season;
  series?: (string | null) | ScreeningSery;
  header?: (string | null) | Media;
  poster?: (string | null) | Media;
  info?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  films?:
    | {
        filmprint: string | FilmPrint;
        isSupportingFilm?: boolean | null;
        info?:
          | {
              [k: string]: unknown;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
  moderator?: string | null;
  guest?: string | null;
  excludeFromUpcoming?: boolean | null;
  url: string;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "locations".
 */
export interface Location {
  id: string;
  name?: string | null;
  default?: boolean | null;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "seasons".
 */
export interface Season {
  id: string;
  name: string;
  header: string | Media;
  sort?: string | null;
  url: string;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "screeningSeries".
 */
export interface ScreeningSery {
  id: string;
  name: string;
  layout: {
    blocks: (
      | {
          text?: string | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'heading';
        }
      | {
          image: string | Media;
          navigation?: (string | null) | Navigation;
          id?: string | null;
          blockName?: string | null;
          blockType: 'headerImage';
        }
      | {
          content?:
            | {
                [k: string]: unknown;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'content';
        }
      | {
          id?: string | null;
          blockName?: string | null;
          blockType: 'outlet';
        }
      | {
          image: string | Media;
          id?: string | null;
          blockName?: string | null;
          blockType: 'image';
        }
      | {
          images?:
            | {
                image: string | Media;
                id?: string | null;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'gallery';
        }
      | {
          url: string;
          id?: string | null;
          blockName?: string | null;
          blockType: 'video';
        }
      | {
          type?: ('manual' | 'screeningSeries') | null;
          events?:
            | {
                doc: string | Event;
                id?: string | null;
              }[]
            | null;
          screeningSeries?: (string | null) | ScreeningSery;
          id?: string | null;
          blockName?: string | null;
          blockType: 'events';
        }
      | {
          html: string;
          id?: string | null;
          blockName?: string | null;
          blockType: 'rawHTML';
        }
    )[];
    type: 'default' | 'info';
  };
  url: string;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "navigations".
 */
export interface Navigation {
  id: string;
  type: 'main' | 'mobile' | 'footer' | 'socialMedia' | 'subnavigation';
  items?:
    | {
        type?: ('internal' | 'external' | 'subnavigation' | 'language') | null;
        name?: string | null;
        page?: (string | null) | StaticPage;
        relPath?: string | null;
        url?: string | null;
        icon?: (string | null) | Media;
        subnavigation?: (string | null) | Navigation;
        newTab?: boolean | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "staticPages".
 */
export interface StaticPage {
  id: string;
  title: string;
  layout: {
    blocks: (
      | {
          text?: string | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'heading';
        }
      | {
          image: string | Media;
          navigation?: (string | null) | Navigation;
          id?: string | null;
          blockName?: string | null;
          blockType: 'headerImage';
        }
      | {
          content?:
            | {
                [k: string]: unknown;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'content';
        }
      | {
          id?: string | null;
          blockName?: string | null;
          blockType: 'outlet';
        }
      | {
          image: string | Media;
          id?: string | null;
          blockName?: string | null;
          blockType: 'image';
        }
      | {
          images?:
            | {
                image: string | Media;
                id?: string | null;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'gallery';
        }
      | {
          url: string;
          id?: string | null;
          blockName?: string | null;
          blockType: 'video';
        }
      | {
          type?: ('manual' | 'screeningSeries') | null;
          events?:
            | {
                doc: string | Event;
                id?: string | null;
              }[]
            | null;
          screeningSeries?: (string | null) | ScreeningSery;
          id?: string | null;
          blockName?: string | null;
          blockType: 'events';
        }
      | {
          html: string;
          id?: string | null;
          blockName?: string | null;
          blockType: 'rawHTML';
        }
    )[];
    type: 'default' | 'info';
  };
  meta?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    image?: (string | null) | Media;
  };
  url: string;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts".
 */
export interface Post {
  id: string;
  title: string;
  date: string;
  header: string | Media;
  content: {
    [k: string]: unknown;
  }[];
  details?:
    | (
        | {
            content?:
              | {
                  [k: string]: unknown;
                }[]
              | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'content';
          }
        | {
            image: string | Media;
            id?: string | null;
            blockName?: string | null;
            blockType: 'image';
          }
        | {
            images?:
              | {
                  image: string | Media;
                  id?: string | null;
                }[]
              | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'gallery';
          }
        | {
            url: string;
            id?: string | null;
            blockName?: string | null;
            blockType: 'video';
          }
      )[]
    | null;
  link?: {
    type?: ('none' | 'internal' | 'external') | null;
    doc?:
      | ({
          relationTo: 'posts';
          value: string | Post;
        } | null)
      | ({
          relationTo: 'staticPages';
          value: string | StaticPage;
        } | null)
      | ({
          relationTo: 'events';
          value: string | Event;
        } | null)
      | ({
          relationTo: 'screeningSeries';
          value: string | ScreeningSery;
        } | null)
      | ({
          relationTo: 'filmPrints';
          value: string | FilmPrint;
        } | null)
      | ({
          relationTo: 'seasons';
          value: string | Season;
        } | null);
    url?: string | null;
  };
  url: string;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "mailings".
 */
export interface Mailing {
  id: string;
  subject: string;
  color?: string | null;
  language?: ('en' | 'de') | null;
  header?: {
    image?: (string | null) | Media;
    overlay?: (string | null) | Media;
  };
  content?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  footer?: {
    image?: (string | null) | Media;
    label?: string | null;
    link?: string | null;
  };
  html?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  name: string;
  role?: ('admin' | 'editor') | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'movies';
        value: string | Movie;
      } | null)
    | ({
        relationTo: 'filmPrints';
        value: string | FilmPrint;
      } | null)
    | ({
        relationTo: 'events';
        value: string | Event;
      } | null)
    | ({
        relationTo: 'screeningSeries';
        value: string | ScreeningSery;
      } | null)
    | ({
        relationTo: 'posts';
        value: string | Post;
      } | null)
    | ({
        relationTo: 'mailings';
        value: string | Mailing;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'staticPages';
        value: string | StaticPage;
      } | null)
    | ({
        relationTo: 'formats';
        value: string | Format;
      } | null)
    | ({
        relationTo: 'aspectRatios';
        value: string | AspectRatio;
      } | null)
    | ({
        relationTo: 'carriers';
        value: string | Carrier;
      } | null)
    | ({
        relationTo: 'languageVersions';
        value: string | LanguageVersion;
      } | null)
    | ({
        relationTo: 'soundFormats';
        value: string | SoundFormat;
      } | null)
    | ({
        relationTo: 'conditions';
        value: string | Condition;
      } | null)
    | ({
        relationTo: 'seasons';
        value: string | Season;
      } | null)
    | ({
        relationTo: 'genres';
        value: string | Genre;
      } | null)
    | ({
        relationTo: 'locations';
        value: string | Location;
      } | null)
    | ({
        relationTo: 'rentals';
        value: string | Rental;
      } | null)
    | ({
        relationTo: 'colors';
        value: string | Color;
      } | null)
    | ({
        relationTo: 'categories';
        value: string | Category;
      } | null)
    | ({
        relationTo: 'persons';
        value: string | Person;
      } | null)
    | ({
        relationTo: 'jobs';
        value: string | Job;
      } | null)
    | ({
        relationTo: 'companies';
        value: string | Company;
      } | null)
    | ({
        relationTo: 'countries';
        value: string | Country;
      } | null)
    | ({
        relationTo: 'navigations';
        value: string | Navigation;
      } | null)
    | ({
        relationTo: 'users';
        value: string | User;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "site".
 */
export interface Site {
  id: string;
  logo?: (string | null) | Media;
  logoMobile?: (string | null) | Media;
  favicon?: (string | null) | Media;
  footerContent?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  location: {
    country: string | Country;
    region: string;
    city: string;
    zip: string;
    street: string;
    name: string;
    latitude: string;
    longitude: string;
  };
  meta?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    image?: (string | null) | Media;
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "blog".
 */
export interface Blog {
  id: string;
  layout: {
    blocks: (
      | {
          text?: string | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'heading';
        }
      | {
          image: string | Media;
          navigation?: (string | null) | Navigation;
          id?: string | null;
          blockName?: string | null;
          blockType: 'headerImage';
        }
      | {
          content?:
            | {
                [k: string]: unknown;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'content';
        }
      | {
          id?: string | null;
          blockName?: string | null;
          blockType: 'outlet';
        }
      | {
          image: string | Media;
          id?: string | null;
          blockName?: string | null;
          blockType: 'image';
        }
      | {
          images?:
            | {
                image: string | Media;
                id?: string | null;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'gallery';
        }
      | {
          url: string;
          id?: string | null;
          blockName?: string | null;
          blockType: 'video';
        }
      | {
          type?: ('manual' | 'screeningSeries') | null;
          events?:
            | {
                doc: string | Event;
                id?: string | null;
              }[]
            | null;
          screeningSeries?: (string | null) | ScreeningSery;
          id?: string | null;
          blockName?: string | null;
          blockType: 'events';
        }
      | {
          html: string;
          id?: string | null;
          blockName?: string | null;
          blockType: 'rawHTML';
        }
    )[];
    type: 'default' | 'info';
  };
  meta?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    image?: (string | null) | Media;
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "eventsPage".
 */
export interface EventsPage {
  id: string;
  layout: {
    blocks: (
      | {
          text?: string | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'heading';
        }
      | {
          image: string | Media;
          navigation?: (string | null) | Navigation;
          id?: string | null;
          blockName?: string | null;
          blockType: 'headerImage';
        }
      | {
          content?:
            | {
                [k: string]: unknown;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'content';
        }
      | {
          id?: string | null;
          blockName?: string | null;
          blockType: 'outlet';
        }
      | {
          image: string | Media;
          id?: string | null;
          blockName?: string | null;
          blockType: 'image';
        }
      | {
          images?:
            | {
                image: string | Media;
                id?: string | null;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'gallery';
        }
      | {
          url: string;
          id?: string | null;
          blockName?: string | null;
          blockType: 'video';
        }
      | {
          type?: ('manual' | 'screeningSeries') | null;
          events?:
            | {
                doc: string | Event;
                id?: string | null;
              }[]
            | null;
          screeningSeries?: (string | null) | ScreeningSery;
          id?: string | null;
          blockName?: string | null;
          blockType: 'events';
        }
      | {
          html: string;
          id?: string | null;
          blockName?: string | null;
          blockType: 'rawHTML';
        }
    )[];
    type: 'default' | 'info';
  };
  meta?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    image?: (string | null) | Media;
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "seasonsPage".
 */
export interface SeasonsPage {
  id: string;
  layout: {
    blocks: (
      | {
          text?: string | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'heading';
        }
      | {
          image: string | Media;
          navigation?: (string | null) | Navigation;
          id?: string | null;
          blockName?: string | null;
          blockType: 'headerImage';
        }
      | {
          content?:
            | {
                [k: string]: unknown;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'content';
        }
      | {
          id?: string | null;
          blockName?: string | null;
          blockType: 'outlet';
        }
      | {
          image: string | Media;
          id?: string | null;
          blockName?: string | null;
          blockType: 'image';
        }
      | {
          images?:
            | {
                image: string | Media;
                id?: string | null;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'gallery';
        }
      | {
          url: string;
          id?: string | null;
          blockName?: string | null;
          blockType: 'video';
        }
      | {
          type?: ('manual' | 'screeningSeries') | null;
          events?:
            | {
                doc: string | Event;
                id?: string | null;
              }[]
            | null;
          screeningSeries?: (string | null) | ScreeningSery;
          id?: string | null;
          blockName?: string | null;
          blockType: 'events';
        }
      | {
          html: string;
          id?: string | null;
          blockName?: string | null;
          blockType: 'rawHTML';
        }
    )[];
    type: 'default' | 'info';
  };
  meta?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    image?: (string | null) | Media;
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "archive".
 */
export interface Archive {
  id: string;
  layout: {
    blocks: (
      | {
          text?: string | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'heading';
        }
      | {
          image: string | Media;
          navigation?: (string | null) | Navigation;
          id?: string | null;
          blockName?: string | null;
          blockType: 'headerImage';
        }
      | {
          content?:
            | {
                [k: string]: unknown;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'content';
        }
      | {
          id?: string | null;
          blockName?: string | null;
          blockType: 'outlet';
        }
      | {
          image: string | Media;
          id?: string | null;
          blockName?: string | null;
          blockType: 'image';
        }
      | {
          images?:
            | {
                image: string | Media;
                id?: string | null;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'gallery';
        }
      | {
          url: string;
          id?: string | null;
          blockName?: string | null;
          blockType: 'video';
        }
      | {
          type?: ('manual' | 'screeningSeries') | null;
          events?:
            | {
                doc: string | Event;
                id?: string | null;
              }[]
            | null;
          screeningSeries?: (string | null) | ScreeningSery;
          id?: string | null;
          blockName?: string | null;
          blockType: 'events';
        }
      | {
          html: string;
          id?: string | null;
          blockName?: string | null;
          blockType: 'rawHTML';
        }
    )[];
    type: 'default' | 'info';
  };
  meta?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    image?: (string | null) | Media;
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}