import type { CollectionBeforeValidateHook } from 'payload'
import type { Event, Movie } from '@app/types/payload'
import type { LexicalRichTextAdapter } from '@payloadcms/richtext-lexical'
import { type Locale } from '@app/i18n'
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless'
import { getEnabledNodes } from '@payloadcms/richtext-lexical'
import { $getRoot } from '@payloadcms/richtext-lexical/lexical'
import { getMovieData } from './shared/getMovieData'
import { formatSlug } from '@app/util/formatSlug'

export const generateImplicitData: CollectionBeforeValidateHook<Event> = async ({
  data,
  req: { payload, locale, context },
  originalDoc,
}) => {
  if (context.triggerHooks === false) return
  if (typeof data === 'undefined') return

  const isScreeningEvent = data.programItems?.some(
    (item) => item.type === 'screening' && item.isMainProgram,
  )

  const mainProgramItem = data.programItems?.findLast((item) => item.isMainProgram)
  const mainProgramFilmPrint =
    typeof mainProgramItem?.filmPrint === 'string'
      ? mainProgramItem?.filmPrint
      : mainProgramItem?.filmPrint?.id

  const update: Partial<Event> = {
    isScreeningEvent,
    mainProgramFilmPrint,
    // get programItems.poster from programItems.filmPrint.movie.poster
    programItems: await Promise.all(
      (data.programItems ?? []).map(async (item) => {
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
          })

          return {
            ...item,
            poster: (filmPrint?.movie as Movie)?.poster as string,
          }
        }
        return item
      }),
    ),
  }

  if (isScreeningEvent && mainProgramFilmPrint) {
    // for screenings, get shortDescription from movie.synopsis
    // and title from movie.title (if not already set)
    const movie = await getMovieData({
      filmPrintID: mainProgramFilmPrint,
      payload,
      locale: locale as Locale,
    })
    if (movie) {
      update.title = data.title || movie.title
      update.shortDescription = movie.synopsis
      update.header = movie.still

      if (data.slugLock) {
        update.slug = formatSlug(
          [movie.internationalTitle || data.title, data.date ? data.date.substr(0, 10) : false]
            .filter(Boolean)
            .join('-'),
        )
      }
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

      update.shortDescription = headlessEditor
        .getEditorState()
        .read(() => $getRoot().getTextContent())

      if (data.slugLock) update.slug = formatSlug(data.title)
    }
  }

  // slug is not locked, we shoud not overwrite it
  if (!data.slugLock) {
    if (data.slug) {
      update.slug = formatSlug(data.slug)
    } else if (originalDoc?.slug) {
      update.slug = formatSlug(originalDoc.slug)
    }
  }

  return {
    ...data,
    ...update,
  }
}
