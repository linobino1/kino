// @ts-nocheck - they payload config has changed a lot since this migration was written
import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-mongodb";
import type { FilmPrint, Movie } from "payload/generated-types";
import { options } from "../app/i18n";

// compute screenings.title from screenings.films[0].filmprint.movie.title
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  for (const locale of options.supportedLngs) {
    const screenings = await payload.find({
      collection: "events",
      depth: 4,
      locale,
    });

    for (const screening of screenings.docs) {
      if (screening.title || !screening.films?.length) {
        continue;
      }

      const title = (
        (screening.films?.[0]?.filmprint as FilmPrint)?.movie as Movie
      )?.title;

      await payload.update({
        collection: "events",
        id: screening.id,
        data: {
          title,
        },
        locale,
      });
    }
  }
}

// we don't do anything, as the title field may be saved in the database with the previous implementation as well
export async function down({ payload }: MigrateDownArgs): Promise<void> {}
