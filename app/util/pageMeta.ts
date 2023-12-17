import type {
  LoaderFunction,
  MetaFunction,
  MetaDescriptor,
} from "@remix-run/node";
import type { Meta } from "cms/fields/meta";

export const pageMeta = (page: Meta, site: Meta): MetaDescriptor[] => {
  console.log("pageMeta", page, site);
  console.log("t", pageTitle(site?.title, page?.title));
  return [
    {
      title: pageTitle(site?.title, page?.title),
    },
    {
      name: "description",
      content: pageDescription(site?.description, page?.description),
    },
    {
      name: "keywords",
      content: pageKeywords(site?.keywords, page?.keywords),
    },
  ];
};

export const pageTitle = (siteTitle?: string, title?: string): string => {
  if (!title) {
    return siteTitle || "";
  }
  return [title, siteTitle].filter(Boolean).join(" | ");
};

export const pageDescription = (
  siteDescription?: string,
  description?: string
): string => {
  return description || siteDescription || "";
};

export const pageKeywords = (
  siteKeywords?: string,
  keywords?: string
): string => {
  return [keywords, siteKeywords].filter(Boolean).join(", ");
};

/**
 * https://gist.github.com/ryanflorence/ec1849c6d690cfbffcb408ecd633e069
 * @param overrideFn MetaFunction
 * @param appendFn MetaFunction
 * @returns MetaFunction
 */
export const mergeMeta = <
  Loader extends LoaderFunction | unknown = unknown,
  ParentsLoaders extends Record<string, LoaderFunction> = Record<
    string,
    LoaderFunction
  >
>(
  leafMetaFn: MetaFunction<Loader, ParentsLoaders>
): MetaFunction<Loader, ParentsLoaders> => {
  return (arg) => {
    let leafMeta = leafMetaFn(arg);

    return arg.matches.reduceRight((acc, match) => {
      for (let parentMeta of match.meta) {
        let index = acc.findIndex(
          (meta) =>
            ("name" in meta &&
              "name" in parentMeta &&
              meta.name === parentMeta.name) ||
            ("property" in meta &&
              "property" in parentMeta &&
              meta.property === parentMeta.property) ||
            ("charSet" in meta &&
              "charSet" in parentMeta &&
              meta.charSet === parentMeta.charSet) ||
            // HACK: we only allow one rel=xxx meta tag for each rel type
            ("rel" in meta &&
              "rel" in parentMeta &&
              meta.rel === parentMeta.rel) ||
            ("title" in meta && "title" in parentMeta)
        );
        if (index == -1) {
          // Parent meta not found in acc, so add it
          acc.push(parentMeta);
        }
      }
      return acc;
    }, leafMeta);
  };
};
