import payload from "payload";
import path from "path";
import fs from "fs";
import invariant from "tiny-invariant";
import type { Config } from "payload/generated-types";

require('dotenv').config();

const mediaDir = path.resolve(__dirname, '../../../media');
const mediaCollections: {
  slug: keyof Config['collections']
  relDir: string
}[] = [
  {
    slug: 'media',
    relDir: '',
  },
];
// only regenerate these extensions
const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const regenerateMediaSizes = async () => {
  try {
    invariant(process.env.PAYLOAD_SECRET, "PAYLOAD_SECRET is required");
    invariant(process.env.MONGODB_URI, "MONGODB_URI is required");

    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      mongoURL: process.env.MONGODB_URI,
      local: true,
    });
  } catch (err) {
    console.log('Unable to initialize payload');
    console.error(err);
    process.exit(0);
  }
  
  await Promise.all(mediaCollections.map(async (collection) => {
    const media = await payload.find({
      collection: collection.slug,
      depth: 0,
      limit: 300,
    });

    await Promise.all(media.docs.map(async (mediaDoc: any) => {
      // skip files that are not images
      if (!extensions.some((ext) => mediaDoc.filename?.toLowerCase().endsWith(ext))) {
        console.log(`skipping ${mediaDoc.filename}`);
        return;
      }
      const filePath = `${mediaDir}${collection.relDir}/${mediaDoc.filename}`;
      const tempFilePath = `${mediaDir}${collection.relDir}/temp_${mediaDoc.filename}`;
      
      if (!fs.existsSync(filePath)) {
        console.log(`does not exist: ${filePath}`);
        return;
      }
      
      // copy original (not sure why, but payload deletes the original ...)
      try {
        fs.copyFileSync(filePath, tempFilePath);
        console.log(`${filePath} => ${tempFilePath}`)
      } catch (err) {
        console.log(`could not create a copy of the original ${filePath} at ${tempFilePath}`)
        console.log(err)
      }

      try {
        await payload.update({
          collection: collection.slug,
          id: mediaDoc.id,
          data: mediaDoc,
          filePath,
          overwriteExistingFiles: true,
        });
        console.log(`Media ${mediaDoc.filename} regenerated successfully`);
      } catch (err) {
        console.error(`Media ${mediaDoc.filename} failed to regenerate`);
        console.error(err);
      } finally {
        try {
          // restore original from copy
          fs.renameSync(tempFilePath, filePath);
          console.log(`${tempFilePath} => ${filePath}`)
        } catch (err) {
          console.log(`could not restore original ${tempFilePath} to ${filePath}`)
          console.log(err)
        }
        try {
          // remove temp file
          fs.rmSync(tempFilePath);
        } catch {}
      }
     }));
         
   }));

  console.log('Media size regeneration completed!');
  process.exit(0);
};

regenerateMediaSizes();