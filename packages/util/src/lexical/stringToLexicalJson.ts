import type { SerializedLexicalEditorState } from './types'

/**
 * Generates a Lexical JSON structure from a plain text string. Line breaks are represented as "linebreak" nodes in the resulting JSON.
 **/
export const stringToLexicalJson = (text: string): SerializedLexicalEditorState => {
  const lines = text.split(/\r\n|\n|\r/)

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          version: 1,
          format: '',
          mode: 'normal',
          style: '',
          direction: 'ltr',
          children: lines.flatMap((line, index) => {
            const textNode = {
              type: 'text',
              text: line,
              detail: 0,
              format: '',
              mode: 'normal',
              style: '',
              direction: 'ltr',
              version: 1,
            }

            if (index < lines.length - 1) {
              return [
                textNode,
                {
                  type: 'linebreak',
                  direction: 'ltr',
                  detail: 0,
                  format: '',
                  mode: 'normal',
                  style: '',
                  version: 1,
                },
              ]
            }

            return [textNode]
          }),
        },
      ],
    },
  }
}
