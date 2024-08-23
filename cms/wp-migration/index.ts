import type { GeneratedTypes } from "payload";
import payload from "payload";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { debugResetDatabase, dir } from "./util/config";
import { migrateVideothek } from "./migrateVideothek";
import { migrateFilmprints } from "./migrateFilmprints";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

/**
 * Run the migration. Do this locally and use your production connection string once you're ready to run it in production.
 */
const run = async () => {
  // Create the directory to download files to
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // make we don't delete our production database (though you can still use your production connection string in development environment)
  if (process.env.NODE_ENV === "production" && debugResetDatabase) {
    throw new Error("Resetting the database not allowed in production");
  }

  await payload.init({
    secret: process.env.PAYLOAD_SECRET ?? "",
    local: true, // Enables local mode, doesn't spin up a server or frontend
  });

  // Reset the database if the flag is set
  if (debugResetDatabase) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Resetting the database not allowed in production");
    }
    if (!process.env.MONGO_URL?.includes("localhost")) {
      throw new Error(
        "CAUTION: You are about to reset a non-local database. Aborting."
      );
    }
    const collections: Array<keyof GeneratedTypes["collections"]> = [
      "movies",
      "persons",
      "media",
    ];
    await Promise.all(
      collections.map(async (collection) => {
        payload.delete({
          collection,
          where: { id: { exists: true } },
        });
      })
    );
    payload.logger.info(`Deleted all ${collections.join(", ")}`);
  }

  // run migrations
  await migrateVideothek({ payload });
  await migrateFilmprints({ payload });

  payload.logger.info("Migration complete");
  process.exit();
};

run();
