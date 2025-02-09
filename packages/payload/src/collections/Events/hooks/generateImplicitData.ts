import type { CollectionBeforeValidateHook } from 'payload'
import type { Event, Movie } from '@app/types/payload'
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless'
import type { LexicalRichTextAdapter } from '@payloadcms/richtext-lexical'
import { getEnabledNodes } from '@payloadcms/richtext-lexical'
import { $getRoot } from '@payloadcms/richtext-lexical/lexical'

export const generateImplicitData: CollectionBeforeValidateHook<Event> = async ({
  data,
  req: { payload, locale },
}) => {
  if (typeof data === 'undefined') return

  const isScreeningEvent = data.programItems?.some(
    (item) => item.type === 'screening' && item.isMainProgram,
  )

  let title = data.title
  let header = data.header
  let shortDescription: string | undefined
  const mainProgramFilmPrint = data.programItems?.findLast((item) => item.isMainProgram)
    ?.filmPrint as string | undefined

  if (isScreeningEvent) {
    if (mainProgramFilmPrint) {
      const filmPrint = await payload.findByID({
        collection: 'filmPrints',
        id: mainProgramFilmPrint,
        locale: locale,
        depth: 1,
        select: {
          movie: true,
        },
        populate: {
          movies: {
            title: true,
            still: true,
            synopsis: true,
          },
        },
      })

      // get title and header from last main film
      title = (filmPrint?.movie as Movie)?.title
      header = (filmPrint?.movie as Movie)?.still
      shortDescription = (filmPrint?.movie as Movie)?.synopsis
    }
  } else {
    // get shortDescription from event.info (converted to plaintext)
    if (data.intro) {
      const headlessEditor = createHeadlessEditor({
        nodes: getEnabledNodes({
          editorConfig: (payload.config.editor as LexicalRichTextAdapter).editorConfig,
        }),
      })

      try {
        headlessEditor.update(
          () => {
            headlessEditor.setEditorState(headlessEditor.parseEditorState(data.intro as any))
          },
          { discrete: true }, // This should commit the editor state immediately
        )
      } catch (e) {
        payload.logger.error({ err: e }, 'ERROR parsing editor state')
      }

      shortDescription = headlessEditor.getEditorState().read(() => $getRoot().getTextContent())
    }
  }

  return {
    ...data,
    isScreeningEvent,
    title,
    header,
    shortDescription,
    mainProgramFilmPrint,
    // get programItems.poster from programItems.filmPrint.movie.poster
    programItems: await Promise.all(
      (data.programItems ?? []).map(async (item) => {
        if (item.type === 'screening' && item.filmPrint) {
          const filmPrint = await payload.findByID({
            collection: 'filmPrints',
            id: typeof item.filmPrint === 'string' ? item.filmPrint : item.filmPrint.id,
            locale: locale,
            depth: 1,
            select: {
              movie: true,
            },
            populate: {
              movies: {
                still: true,
              },
            },
          })

          return {
            ...item,
            poster: (filmPrint?.movie as Movie)?.still as string,
          }
        }
        return item
      }),
    ),
  } satisfies Partial<Event>
}
