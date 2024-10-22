import React from 'react'
import { Serialize } from './Serialize'
import { classes } from '~/classes'

export const RichText: React.FC<{
  className?: string
  content: any
}> = ({ className, content }) => {
  // don't render if there is no content (or if there is only one empty content, which happens
  // when you delete all content from the rich text editor field)
  if (
    !content ||
    content.length === 0 ||
    (content.length === 1 && content[0].children.length === 0) ||
    (content[0].children.length === 1 && content[0].children[0].text === '')
  )
    return null

  return (
    <div className={[classes.container, className].filter(Boolean).join(' ')}>
      <Serialize content={content} />
    </div>
  )
}

export const RichTextPlain: ({ content }: { content: any }) => string = () => {
  return 's'
}

export default RichText
