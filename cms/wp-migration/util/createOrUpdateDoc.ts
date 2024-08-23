import type { GeneratedTypes, Payload } from "payload";
import type { Options as CreateOptions } from "payload/dist/collections/operations/local/create";

export type createOrUpdateDocFunction<
  T extends keyof GeneratedTypes["collections"]
> = {
  payload: Payload;
  collection: T;
  data: CreateOptions<T>["data"];
  where?: CreateOptions<T>["data"];
};

export const createOrUpdateDoc = async ({
  payload,
  collection,
  data,
  where,
}: createOrUpdateDocFunction<any>) => {
  if (!where) {
    where = Object.entries(data).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: { equals: value },
      }),
      {}
    );
  }
  const existingDocs = await payload.find({
    collection,
    where,
  });

  if (existingDocs.docs.length > 0) {
    return payload.update({
      collection,
      id: existingDocs.docs[0].id,
      data,
    });
  } else {
    return await payload.create({
      collection,
      data,
    });
  }
};
