import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-mongodb";
import type { Screening } from "payload/generated-types";

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // merge screenings.featureFilms and screenings.supportingFilms into screenings.films
  // transform screenings.info into screenings.films[0].info
  (await payload.db.collections.screenings.find()).forEach(
    async (screening) => {
      screening = screening._doc;
      const films: Screening["films"] = [];

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

      // let's add screenings.info to the first film
      if (screening.info && films.length > 0) {
        films[0].info = screening.info;
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
