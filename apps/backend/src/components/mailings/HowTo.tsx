import { Gutter } from '@payloadcms/ui'
import React from 'react'

export const HowTo = () => {
  return (
    <Gutter>
      <h3>How to use Mailings</h3>
      <p>To create a new mailing, follow these steps:</p>
      <ol>
        <li>Create a new item or duplicate the latest item in the list of mailings.</li>
        <li>Edit the content as needed.</li>
        <li>Hit Save.</li>
        <li>
          Scroll down, verify that the HTML preview looks good, and click &quot;Copy to
          clipboard&quot;.
        </li>
        <li>
          Click &quot;What now?&quot; to see the next steps.{' '}
          <i>The button will appear underneath the &quot;Copy to clipboard&quot; button.</i>
        </li>
      </ol>
    </Gutter>
  )
}
