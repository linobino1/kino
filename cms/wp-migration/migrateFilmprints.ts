import { graphql } from "gql.tada";
import { gqlClient } from "./gql";
import type { Movie } from "payload/generated-types";
import type { Payload } from "payload";
import path from "path";
import { downloadFile } from "./util/downloadFile";
import { slugFormat } from "../../cms/plugins/addSlugField";
import { createOrUpdateDoc } from "./util/createOrUpdateDoc";
import { dir, debugSkipDownloads, limit } from "./util/config";
import { stripHtml } from "string-strip-html";

const query = graphql(`
  query Filmkopien($limit: Int) {
    filmkopien(first: $limit) {
      nodes {
        id
        title
        erscheinungsjahre {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            mediaItemUrl
            altText
          }
        }
        regisseure {
          nodes {
            name
          }
        }
        sprachfassungen {
          nodes {
            name
          }
        }
        produktionslNder {
          nodes {
            name
          }
        }
        trGermaterialien {
          nodes {
            name
          }
        }
        filmkopien {
          filmSpieldauer
          filmDeutscherTitel
          filmOriginaltitel
          filmTonformat {
            nodes {
              name
            }
          }
          filmSynopsis
          synopsisEnglischVersion
          filmZustand
          # farbeSchwarzweis {
          #   nodes {
          #     name
          #   }
          # }
          filmBildformat {
            nodes {
              name
            }
          }
          rechteinhaber {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`);

export type migrateVideothekProps = {
  payload: Payload;
};
export const migrateFilmprints = async ({ payload }: migrateVideothekProps) => {
  const res = await gqlClient.query(query, { limit });

  if (res.error) {
    throw res.error;
  }
  if (!res.data) {
    throw new Error("No data returned from GraphQL");
  }

  // don't do this in parallel, there might be collisions adding the same person twice e.g.
  for (const item of res.data.filmkopien?.nodes ?? []) {
    let notes: string[] = [];
    let filmprintNotes: string[] = [];

    let id = item.id;

    // internationalTitle is important for the editor to find the movie, if we don't have that, let's skip the import
    let internationalTitle =
      item.title ??
      item.filmkopien?.filmOriginaltitel ??
      item.filmkopien?.filmDeutscherTitel ??
      "unknown";
    if (internationalTitle === "unknown") {
      console.warn(`No title found for videothek film ${id}, skipping import`);
      continue;
    }
    let slug = slugFormat(internationalTitle);

    // check if the movie already exists
    let existing = await payload.find({
      collection: "movies",
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      console.warn(
        `Movie ${internationalTitle} already exists, skipping import`
      );
      continue;
    }

    let data: Partial<Movie> = {
      internationalTitle,
      isMigratedFromWordpress: true,
      isHfgProduction: true,
    };
    if (item.erscheinungsjahre?.nodes[0]?.name) {
      data.year = parseInt(item.erscheinungsjahre?.nodes[0]?.name);
    }
    if (item.filmkopien?.filmSpieldauer) {
      data.duration = item.filmkopien?.filmSpieldauer;
    }
    // create a new person for the director
    if (item.regisseure?.nodes[0]?.name) {
      let director = await createOrUpdateDoc({
        payload,
        collection: "persons",
        data: {
          name: item.regisseure?.nodes[0]?.name,
        },
      });
      data.directors = [director.id];
    }

    // create the still image
    if (item.featuredImage?.node?.mediaItemUrl) {
      const filePath = path.join(dir, `${slug}.jpg`);
      if (!debugSkipDownloads) {
        await downloadFile(item.featuredImage?.node?.mediaItemUrl, filePath);
      }

      try {
        const media = await payload.create({
          collection: "media",
          data: {
            filename: `${slug}-backdrop.jpg`,
            alt: item.featuredImage?.node?.altText,
          },
          filePath,
          locale: "de",
          draft: true,
        });

        data.still = media.id;
      } catch (e) {
        console.warn(`Error creating media for ${slug}: ${e}`);
      }
    }

    // sound format is now on the filmprint, let's just put it in the notes
    if (item.filmkopien?.filmTonformat?.nodes[0]?.name) {
      filmprintNotes.push(
        `Tonformat: ${item.filmkopien?.filmTonformat?.nodes[0]?.name}`
      );
    }
    // language is now on the filmprint, let's just put it in the notes
    if (item.sprachfassungen?.nodes[0]?.name) {
      filmprintNotes.push(
        `Sprachfassung: ${item.sprachfassungen?.nodes[0]?.name}`
      );
    }
    if (item.filmkopien?.filmSynopsis) {
      data.synopsis = stripHtml(item.filmkopien?.filmSynopsis).result;
    }
    if (item.filmkopien?.filmZustand) {
      filmprintNotes.push(`Zustand: ${item.filmkopien?.filmZustand}`);
    }
    if (item.produktionslNder?.nodes[0]?.name) {
      notes.push(`Produktionsland: ${item.produktionslNder?.nodes[0]?.name}`);
    }
    if (item.filmkopien?.filmBildformat?.nodes[0]?.name) {
      filmprintNotes.push(
        `Bildformat: ${item.filmkopien?.filmBildformat?.nodes[0]?.name}`
      );
    }
    if (item.filmkopien?.rechteinhaber?.nodes[0]?.name) {
      filmprintNotes.push(
        `Rechteinhaber: ${item.filmkopien?.rechteinhaber?.nodes[0]?.name}`
      );
    }
    if (item.trGermaterialien?.nodes[0]?.name) {
      filmprintNotes.push(
        `Trägermaterial: ${item.trGermaterialien?.nodes[0]?.name}`
      );
    }

    notes.push("\nFilmprint:");
    notes.push(filmprintNotes.join("\n"));
    data.wordpressMigrationNotes = notes.join("\n");

    const doc = await payload.create({
      collection: "movies",
      // @ts-ignore it will be hard to match the types here
      data,
      locale: "de",
      draft: true,
    });

    // add english version of the synopsis
    if (item.filmkopien?.synopsisEnglischVersion) {
      await payload.update({
        collection: "movies",
        id: doc.id,
        data: {
          synopsis: stripHtml(item.filmkopien?.synopsisEnglischVersion).result,
        },
        locale: "en",
        draft: true,
      });
    }

    payload.logger.info(`Migrated Filmprint ${internationalTitle}`);
  }
};
