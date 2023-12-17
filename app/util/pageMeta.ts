import type {
  LoaderFunction,
  V2_HtmlMetaDescriptor,
  V2_MetaFunction,
} from "@remix-run/node";
import type { Meta } from "cms/fields/meta";

export const pageMeta = (page: Meta, site: Meta): V2_HtmlMetaDescriptor[] => {
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
 * @param overrideFn V2_MetaFunction
 * @param appendFn V2_MetaFunction
 * @returns V2_MetaFunction
 */
export const mergeMeta = <
  Loader extends LoaderFunction | unknown = unknown,
  ParentsLoaders extends Record<string, LoaderFunction> = Record<
    string,
    LoaderFunction
  >
>(
  leafMetaFn: V2_MetaFunction<Loader, ParentsLoaders>
): V2_MetaFunction<Loader, ParentsLoaders> => {
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
