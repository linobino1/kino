import type { LoaderFunction, MetaFunction, MetaDescriptor } from '@remix-run/node'
import type { Meta } from '@/fields/meta'
import { unescape } from 'html-escaper'

export const pageMeta = (page: Meta, site: Meta): MetaDescriptor[] => {
  return [
    {
      title: pageTitle(site?.title, page?.title),
    },
    {
      name: 'description',
      content: pageDescription(site?.description, page?.description),
    },
    {
      name: 'keywords',
      content: pageKeywords(site?.keywords, page?.keywords),
    },
  ]
}

export const pageTitle = (siteTitle?: string | null, title?: string | null): string => {
  if (!title) {
    return siteTitle || ''
  }
  return unescape([title, siteTitle].filter(Boolean).join(' | '))
}

export const pageDescription = (
  siteDescription?: string | null,
  description?: string | null,
): string => {
  return description || siteDescription || ''
}

export const pageKeywords = (siteKeywords?: string | null, keywords?: string | null): string => {
  return [keywords, siteKeywords].filter(Boolean).join(', ')
}

/**
 * https://gist.github.com/ryanflorence/ec1849c6d690cfbffcb408ecd633e069
 * @param leafMetaFn MetaFunction
 * @returns MetaFunction
 */
export const mergeMeta = <
  Loader extends LoaderFunction | unknown = unknown,
  ParentsLoaders extends Record<string, LoaderFunction> = Record<string, LoaderFunction>,
>(
  leafMetaFn: MetaFunction<Loader, ParentsLoaders>,
): MetaFunction<Loader, ParentsLoaders> => {
  return (arg) => {
    const leafMeta = leafMetaFn(arg)

    return arg.matches.reduceRight((acc, match) => {
      for (const parentMeta of match.meta) {
        const index = acc.findIndex(
          (meta) =>
            ('name' in meta && 'name' in parentMeta && meta.name === parentMeta.name) ||
            ('property' in meta &&
              'property' in parentMeta &&
              meta.property === parentMeta.property) ||
            ('charSet' in meta && 'charSet' in parentMeta && meta.charSet === parentMeta.charSet) ||
            // hrefLang are always defined in the parentMeta
            ('hrefLang' in meta &&
              'hrefLang' in parentMeta &&
              meta.hrefLang === parentMeta.hrefLang) ||
            // canonical links are always defined in the parentMeta
            ('rel' in meta &&
              'rel' in parentMeta &&
              meta.rel === parentMeta.rel &&
              meta.rel === 'canonical') ||
            // icon are always defined in the parentMeta
            ('rel' in meta &&
              'rel' in parentMeta &&
              meta.rel === parentMeta.rel &&
              meta.rel === 'icon') ||
            ('title' in meta && 'title' in parentMeta),
        )
        if (index == -1) {
          // Parent meta not found in acc, so add it
          acc.push(parentMeta)
        }
      }
      return acc
    }, leafMeta)
  }
}
