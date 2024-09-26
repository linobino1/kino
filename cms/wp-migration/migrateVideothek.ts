import { graphql } from "gql.tada";
import { gqlClient } from "./gql";
import type { Movie } from "payload/generated-types";
import type { Payload } from "payload";
import path from "path";
import { downloadFile } from "./util/downloadFile";
import { slugFormat } from "../../cms/plugins/addSlugField";
import { createOrUpdateDoc } from "./util/createOrUpdateDoc";
import { stripHtml } from "string-strip-html";
import { dir, debugSkipDownloads, limit } from "./util/config";

const query = graphql(`
  query VideothekFilme($limit: Int) {
    videothekFilme(first: $limit) {
      nodes {
        title
        erscheinungsjahre {
          nodes {
            name
          }
        }
        sprachen {
          nodes {
            name
          }
        }
        videothekFilmId
        featuredImage {
          node {
            mediaItemUrl
            altText
          }
        }
        videothek {
          darumGehts
          filmDeutscherTitel
          filmOriginaltitel
          filmRegie {
            nodes {
              name
            }
          }
          filmSpieldauer
          filmTonformat {
            nodes {
              name
            }
          }
          genre {
            nodes {
              name
            }
          }
          mehrInfos
          trailerUrl
          sprache {
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
export const migrateVideothek = async ({ payload }: migrateVideothekProps) => {
  const res = await gqlClient.query(query, { limit });

  if (res.error) {
    throw res.error;
  }
  if (!res.data) {
    throw new Error("No data returned from GraphQL");
  }

  // don't do this in parallel, there might be collisions adding the same person twice e.g.
  for (const item of res.data.videothekFilme?.nodes ?? []) {
    let id = item.videothekFilmId;

    // internationalTitle is important for the editor to find the movie, if we don't have that, let's skip the import
    let internationalTitle =
      item.title ??
      item.videothek?.filmOriginaltitel ??
      item.videothek?.filmDeutscherTitel ??
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

    let notes: string[] = [];
    let data: Partial<Movie> = {
      internationalTitle,
      isMigratedFromWordpress: true,
      isHfgProduction: true,
    };
    // title is a localized field now, we'll use the german locale
    if (item.videothek?.filmDeutscherTitel) {
      data.title = item.videothek?.filmDeutscherTitel;
    }
    if (item.videothek?.filmOriginaltitel) {
      data.originalTitle = item.videothek?.filmOriginaltitel ?? item.title;
    }
    if (item.erscheinungsjahre?.nodes[0]?.name) {
      data.year = parseInt(item.erscheinungsjahre?.nodes[0]?.name);
    }
    if (item.videothek?.filmSpieldauer) {
      data.duration = item.videothek?.filmSpieldauer;
    }
    // create a new person for the director
    if (item.videothek?.filmRegie?.nodes[0]?.name) {
      try {
        let director = await createOrUpdateDoc({
          payload,
          collection: "persons",
          data: {
            name: item.videothek?.filmRegie?.nodes[0]?.name,
          },
        });
        data.directors = [director.id];
      } catch (e) {
        console.error(e);
        notes.push(`Regisseur: ${item.videothek?.filmRegie?.nodes[0]?.name}`);
      }
    }

    // create the still image
    if (item.featuredImage?.node?.mediaItemUrl) {
      const filePath = path.join(dir, `${id}.jpg`);
      if (!debugSkipDownloads) {
        await downloadFile(item.featuredImage?.node?.mediaItemUrl, filePath);
      }

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
    }

    if (item.videothek?.trailerUrl) {
      data.trailer = item.videothek?.trailerUrl;
    }

    // sound format is now on the filmprint, let's just put it in the notes
    if (item.videothek?.filmTonformat?.nodes[0]?.name) {
      notes.push(`Tonformat: ${item.videothek?.filmTonformat?.nodes[0]?.name}`);
    }
    // language is now on the filmprint, let's just put it in the notes
    if (item.videothek?.sprache?.nodes[0]?.name) {
      notes.push(`Sprache: ${item.videothek?.sprache?.nodes[0]?.name}`);
    }
    // assign genre if it exists, otherwise put it in the notes
    if (item.videothek?.genre?.nodes[0]?.name) {
      const genre = (
        await payload.find({
          collection: "genres",
          where: {
            name: {
              equals: item.videothek?.genre.nodes[0]?.name,
            },
          },
          locale: "de",
        })
      )?.docs[0];
      if (genre) {
        data.genres = [genre.id];
      } else {
        notes.push(
          `Genre manuell zuordnen: ${item.videothek?.genre?.nodes[0]?.name}`
        );
      }
    }

    // synopsis
    if (item.videothek?.darumGehts) {
      data.synopsis = stripHtml(item.videothek?.darumGehts).result;
    }
    if (item.videothek?.mehrInfos) {
      data.synopsis += "\n\n";
      data.synopsis += stripHtml(item.videothek?.mehrInfos).result;
    }

    data.wordpressMigrationNotes = notes.join("\n");

    await payload.create({
      collection: "movies",
      // @ts-ignore it will be hard to match the types here
      data,
      locale: "de",
      draft: true,
    });

    payload.logger.info(`Migrated Videothek movie ${internationalTitle}`);
  }
};
