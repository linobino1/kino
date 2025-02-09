import { Gutter } from '@payloadcms/ui'

const MagicSlugsExplanation: React.FC<any> = () => {
  return (
    <Gutter className="my-4">
      <h3 className="mb-2">Magic Slugs</h3>
      <p>Seiten mit diesen Slugs bekommen magische Funktionen:</p>
      <ul>
        <li>
          <i>home</i> - Startseite, zeigt die nächsten Vorstellungen und die neuesten Blog-Posts
        </li>
        <li>
          <i>seasons</i> - Archiv aller Spielzeiten
        </li>
        <li>
          <i>filmprints</i> - Archiv aller Filmkopien
        </li>
        <li>
          <i>hfg-archive</i> - Archiv aller HfG-Produktionen
        </li>
      </ul>
    </Gutter>
  )
}
export default MagicSlugsExplanation
