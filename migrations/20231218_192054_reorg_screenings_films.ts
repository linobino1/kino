// @ts-nocheck - they payload config has changed a lot since this migration was written
import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-mongodb";
import type { Event } from "payload/generated-types";

// somehow this is the value that was stored in the database for blank slate values
// the admin panel dies when given this value
// maybe there was a slate update in the meantime?
const slateInvalidBlankValue = [
  {
    children: [{}],
  },
];

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // merge screenings.featureFilms and screenings.supportingFilms into screenings.films
  // transform screenings.info into screenings.films[0].info
  (await payload.db.collections.screenings.find()).forEach(
    async (screening) => {
      screening = screening._doc;
      const films: Event["films"] = [];

      (screening.featureFilms || []).forEach(async (filmprint: any) => {
        films.push({
          filmprint,
          isSupportingFilm: false,
        });
      });
      (screening.supportingFilms || []).forEach(async (filmprint: any) => {
        films.push({
          filmprint,
          isSupportingFilm: true,
        });
      });

      // migrate screenings.info
      let { info } = screening;
      // info._doc is the actual info object
      if (
        info &&
        typeof info === "object" &&
        info._doc &&
        typeof info._doc === "object"
      ) {
        // sanitize blank slate values for all locales
        Object.keys(info._doc).forEach((key) => {
          if (
            JSON.stringify(info[key]) === JSON.stringify(slateInvalidBlankValue)
          ) {
            info[key] = null;
          }
        });
      } else {
        info = null;
      }

      // add info to the first film
      if (films.length > 0) {
        films[0].info = info;
      }

      // update screening
      await payload.db.collections.screenings.updateOne(
        {
          _id: screening._id,
        },
        {
          $set: {
            films,
          },
        }
      );
      await payload.db.collections.screenings.updateMany(
        {},
        {
          $unset: {
            featureFilms: "",
            supportingFilms: "",
            info: "",
          },
        },
        { strict: false } // otherwise mongoose will not unset the fields because they are not in the schema
      );
    }
  );
  // throw new Error("stop");
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // unpack screenings.films into screenings.featureFilms and screenings.supportingFilms
  // use screenings.films[0].info as screenings.info
  (await payload.db.collections.screenings.find()).forEach(
    async (screening) => {
      screening = screening._doc;
      const featureFilms: any = [];
      const supportingFilms: any = [];

      (screening.films || []).forEach(async (film: any) => {
        if (film.isSupportingFilm) {
          supportingFilms.push(film.filmprint);
        } else {
          featureFilms.push(film.filmprint);
        }
      });

      // let's add screenings.info to the first film
      let info = null;
      if (screening.films && screening.films.length > 0) {
        info = screening.films[0].info;
      }

      // update screening
      await payload.db.collections.screenings.updateOne(
        {
          _id: screening._id,
        },
        {
          $set: {
            featureFilms,
            supportingFilms,
            info,
          },
        },
        { strict: false } // otherwise mongoose will not set the fields because they are not in the schema
      );
      await payload.db.collections.screenings.updateMany(
        {},
        {
          $unset: {
            films: "",
          },
        },
        { strict: false } // otherwise mongoose will not unset the fields because they are not in the schema
      );
    }
  );
}
