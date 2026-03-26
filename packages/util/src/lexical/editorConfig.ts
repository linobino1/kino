import type { LexicalEditorProps } from '@payloadcms/richtext-lexical'

export const minimalEditorConfig: LexicalEditorProps = {
  features: ({ defaultFeatures }) =>
    defaultFeatures.filter((f) => ['paragraph', 'bold', 'italic', 'toolbarInline'].includes(f.key)),
}
