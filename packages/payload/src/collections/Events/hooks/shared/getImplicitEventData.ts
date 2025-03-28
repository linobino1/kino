import type { Event, Movie } from '@app/types/payload'
import type { LexicalRichTextAdapter } from '@payloadcms/richtext-lexical'
import type { Locale } from '@app/i18n'
import type { Payload } from 'payload'
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless'
import { getEnabledNodes } from '@payloadcms/richtext-lexical'
import { $getRoot } from '@payloadcms/richtext-lexical/lexical'
import { formatSlug } from '@app/util/formatSlug'
import { lexicalToPlainText } from '@app/util/lexical/lexicalToPlainText'

type Props = {
  locale: Locale
  payload: Payload
} & ( // either data and maybe originalDoc is present as in beforeChange hook
  | {
      data: Partial<Event>
      originalDoc?: Partial<Event>
      doc?: never
    }
  // or doc is present as in afterChange hook
  | {
      doc: Partial<Event>
      originalDoc?: never
      data?: never
    }
)

export const getImplicitEventData = async ({ data, doc, originalDoc, locale, payload }: Props) => {
  const event = data ?? doc

  const isScreeningEvent = event.programItems?.some(
    (item) => item.type === 'screening' && item.isMainProgram,
  )

  const mainProgramItem = event.programItems?.findLast((item) => item.isMainProgram)
  const mainProgramFilmPrint =
    typeof mainProgramItem?.filmPrint === 'string'
      ? mainProgramItem?.filmPrint
      : mainProgramItem?.filmPrint?.id

  const hasManyMainProgramItems =
    (event.programItems?.filter((item) => item.isMainProgram).length ?? 0) > 1

  const slugLock = event && 'slugLock' in event ? event.slugLock : originalDoc?.slugLock !== false
  const headerLock =
    event && 'headerLock' in event ? event.headerLock : originalDoc?.headerLock !== false
  const titleLock =
    event && 'titleLock' in event ? event.titleLock : originalDoc?.titleLock !== false

  const res: Partial<Event> = {
    isScreeningEvent,
    mainProgramFilmPrint,
    // get programItems.poster from programItems.filmPrint.movie.poster
    programItems: event.programItems?.length
      ? await Promise.all(
          event.programItems.map(async (item) => {
            if (item.type === 'screening' && item.filmPrint) {
              const filmPrint = await payload.findByID({
                collection: 'filmPrints',
                id: typeof item.filmPrint === 'string' ? item.filmPrint : item.filmPrint.id,
                depth: 1,
                select: {
                  movie: true,
                },
                populate: {
                  movies: {
                    poster: true,
                  },
                },
                locale,
              })

              return {
                ...item,
                poster: (filmPrint?.movie as Movie)?.poster as string,
              }
            }
            return item
          }),
        )
      : undefined,
  }

  if (isScreeningEvent && mainProgramFilmPrint) {
    // for screenings, get shortDescription from movie.synopsis
    // and title from movie.title (if not already set)
    const { movie } = await payload.findByID({
      collection: 'filmPrints',
      id: mainProgramFilmPrint,
      locale,
      depth: 1,
      select: {
        movie: true,
      },
      populate: {
        movies: {
          title: true,
          still: true,
          synopsis: true,
          internationalTitle: true,
        },
      },
    })
    if (movie && typeof movie === 'object') {
      res.title = movie.title
      res.shortDescription = hasManyMainProgramItems
        ? event.intro
          ? lexicalToPlainText(event.intro)
          : ''
        : movie.synopsis
      res.header = movie.still

      res.slug = formatSlug(
        [event.title || movie.internationalTitle, event.date ? event.date.substr(0, 10) : false]
          .filter(Boolean)
          .join('-'),
      )
    }
  } else {
    // for non-screenings, get shortDescription from last main program item
    if (mainProgramItem?.info) {
      const headlessEditor = createHeadlessEditor({
        nodes: getEnabledNodes({
          editorConfig: (payload.config.editor as LexicalRichTextAdapter).editorConfig,
        }),
      })

      try {
        headlessEditor.update(
          () => {
            headlessEditor.setEditorState(
              headlessEditor.parseEditorState(mainProgramItem.info as any),
            )
          },
          { discrete: true }, // This should commit the editor state immediately
        )
      } catch (e) {
        payload.logger.error({ err: e }, 'ERROR parsing editor state')
      }

      res.shortDescription = headlessEditor.getEditorState().read(() => $getRoot().getTextContent())

      res.slug = formatSlug(event.title)
    }
  }

  // slug lock is open, we should use data.slug or originalDoc.slug
  if (!slugLock && (event.slug || originalDoc?.slug)) {
    res.slug = formatSlug(event.slug ?? originalDoc?.slug)
  }

  // header lock is open, we should use data.header or originalDoc.header
  if (!headerLock && (event.header || originalDoc?.header)) {
    res.header = event.header ?? originalDoc?.header
  }

  // title lock is open, we should use data.title or originalDoc.title
  if (!titleLock && (event.title || originalDoc?.title)) {
    res.title = event.title ?? originalDoc?.title
  }

  return res
}
