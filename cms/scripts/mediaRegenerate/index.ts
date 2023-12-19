import payload from "payload";
import path from "path";
import fs from "fs";
import invariant from "tiny-invariant";
import type { Config } from "payload/generated-types";

require("dotenv").config();

/**
 * This script is paginated, so you can run it in chunks. Defaults to page 1, limit 300.
 * e.g. yarn generate-media-sizes 2 300 will run page 2, limit 300
 **/
const page = parseInt(process.argv[2] || "1");
const limit = parseInt(process.argv[3] || "300");

const mediaDir = path.resolve(__dirname, "../../../media");
const mediaCollections: {
  slug: keyof Config["collections"];
  relDir: string;
}[] = [
  {
    slug: "media",
    relDir: "",
  },
];
// only regenerate these extensions
const extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

const regenerateMediaSizes = async () => {
  try {
    invariant(process.env.PAYLOAD_SECRET, "PAYLOAD_SECRET is required");
    invariant(process.env.MONGO_URL, "MONGO_URL is required");

    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: true,
    });
  } catch (err) {
    console.log("Unable to initialize payload");
    console.error(err);
    process.exit(0);
  }

  await Promise.all(
    mediaCollections.map(async (collection) => {
      const media = await payload.find({
        collection: collection.slug,
        depth: 0,
        limit,
        page,
      });

      await Promise.all(
        media.docs.map(async (mediaDoc: any) => {
          // skip files that are not images
          if (
            !extensions.some((ext) =>
              mediaDoc.filename?.toLowerCase().endsWith(ext)
            )
          ) {
            console.log(`skipping ${mediaDoc.filename}`);
            return;
          }

          process.env.S3_ENABLED === "true"
            ? await regenerateS3File(mediaDoc, collection)
            : await regenerateLocalFile(mediaDoc, collection);
        })
      );
    })
  );

  console.log("Media size regeneration completed!");
  process.exit(0);
};

regenerateMediaSizes();

const regenerateLocalFile = async (mediaDoc: any, collection: any) => {
  const path = `${mediaDir}${collection.relDir}/${mediaDoc.filename}`;
  const tmpPath = `${mediaDir}${collection.relDir}/temp_${mediaDoc.filename}`;

  if (!fs.existsSync(path)) {
    console.log(`does not exist: ${path}`);
    return;
  }

  // copy original (not sure why, but payload deletes the original ...)
  try {
    fs.copyFileSync(path, tmpPath);
  } catch (err) {
    console.log(
      `could not create a copy of the original ${path} at ${tmpPath}`
    );
    console.log(err);
  }

  try {
    await payload.update({
      collection: collection.slug,
      id: mediaDoc.id,
      data: mediaDoc,
      filePath: path,
      overwriteExistingFiles: true,
    });
    console.log(`Media ${mediaDoc.filename} regenerated successfully`);
  } catch (err) {
    console.error(`Media ${mediaDoc.filename} failed to regenerate`);
    console.error(err);
  } finally {
    try {
      // restore original from copy
      fs.renameSync(tmpPath, path);
    } catch (err) {
      console.log(`could not restore original ${tmpPath} to ${path}`);
      console.log(err);
    }
    try {
      // remove temp file
      fs.rmSync(tmpPath);
    } catch {}
  }
};

const regenerateS3File = async (mediaDoc: any, collection: any) => {
  try {
    await fetch(mediaDoc.url)
      .then((response) => response.blob())
      .then(async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(new Uint8Array(arrayBuffer));

        const file = {
          data: buffer,
          mimetype: blob.type,
          name: mediaDoc.filename,
          size: mediaDoc.filesize,
        };

        await payload.update({
          collection: collection.slug,
          id: mediaDoc.id,
          data: mediaDoc,
          file,
          overwriteExistingFiles: true,
        });

        console.log(
          `Media ${mediaDoc.filename} regenerated successfully on S3`
        );
      });
  } catch (err) {
    console.error(`Media ${mediaDoc.filename} failed to regenerate on S3`);
    console.error(err);
  }
};
