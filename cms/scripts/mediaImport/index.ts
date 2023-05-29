import payload from "payload";
import path from "path";
import fs from "fs";
import invariant from "tiny-invariant";

require('dotenv').config();

const importDir = path.resolve(__dirname, '../../../mediaimport');

/**
 * add all files from the media folder to the media collection
 */
const mediaBulkImport = async () => {
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
  
  const files = fs.readdirSync(importDir);
  await Promise.all(files.map(async (filename: any) => {
    const filePath = `${importDir}/${filename}`;
    
    if (!fs.existsSync(filePath)) {
      console.log(`does not exist: ${filePath}`);
      return;
    }
    
    // check if media already exists
    const doc = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      where: {
        filename: {
          equals: filename,
        },
      },
    });

    if (doc.docs.length > 0) {
      console.log(`Updating Media ${filename} ...`);
      try {
        await payload.update({
          collection: 'media',
          id: doc.docs[0].id,
          data: {
            alt: doc.docs[0].alt,
          },
          filePath,
          overwriteExistingFiles: true,
        });
        console.log(`Media ${filename} updated successfully`);
      } catch (err) {
        console.error(`Failed updating Media ${filename}`);
        console.error(err);
      }
    } else {
      console.log(`Creating Media ${filename} ...`);

      try {
        await payload.create({
          collection: 'media',
          filePath,
          data: {},
          overwriteExistingFiles: true,
        });
        console.log(`Media ${filename} regenerated successfully`);
      } catch (err) {
        console.error(`Failed importing Media ${filename}`);
        console.error(err);
      }
    }
  }));
  
  console.log('Media size regeneration completed!');
  process.exit(0);
};

mediaBulkImport();