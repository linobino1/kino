import path from "path";

/**
 * The directory to download files to during migration
 */
export const dir = path.resolve(__dirname, "../../../wp-downloads");

/**
 * The max number of items to migrate from each of the collections. Useful for testing, otherwise se to 9999.
 */
export const limit = 9999;

/**
 * Set to true to skip downloading files during development (they might already exist)
 */
export const debugSkipDownloads = false;

/**
 * Set to true to reset the database before running the migration
 */
export const debugResetDatabase = false;
