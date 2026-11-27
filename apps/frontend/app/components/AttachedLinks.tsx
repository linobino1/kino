import { useTranslation } from 'react-i18next'
import { CTAButton } from '~/components/CTAButton'
import { Link } from '~/components/localized-link'
import { eventHref } from '~/util/routeHrefs'

type MediaLink = string | { url?: string | null } | null
type EventLink = string | { slug?: string | null } | null

export type AttachedLink = {
  id?: string | null
  type?: 'programme' | 'download' | 'trailer' | 'event' | 'custom' | null
  url?: string | null
  event?: EventLink
  programme?: MediaLink
  download?: MediaLink
  label?: string | null
}

type Props = {
  links?: AttachedLink[] | null
}

const displayUrl = (url: string) => url.replace(/^https?:\/\//i, '')

export const AttachedLinks: React.FC<Props> = ({ links }) => {
  const { t } = useTranslation()
  const validLinks =
    links?.flatMap((link) => {
      const target =
        link.type === 'event'
          ? typeof link.event === 'object' && link.event
            ? eventHref(link.event.slug)
            : ''
          : link.type === 'programme'
            ? typeof link.programme === 'object' && link.programme
              ? (link.programme.url ?? '')
              : ''
            : link.type === 'download'
              ? typeof link.download === 'object' && link.download
                ? (link.download.url ?? '')
                : ''
              : (link.url ?? '')
      return target ? [{ ...link, target }] : []
    }) ?? []

  if (!validLinks.length) return null

  return (
    <div className="flex flex-wrap gap-3">
      {validLinks.map(({ id, type, target, label }, index) => {
        const external = /^(https?:)?\/\//i.test(target)
        const mediaLink = type === 'programme' || type === 'download'
        const text =
          type === 'custom'
            ? label?.trim() || displayUrl(target)
            : type
              ? t(`links.${type}`)
              : displayUrl(target)

        return (
          <CTAButton
            key={id ?? `${type}-${target}-${index}`}
            as={Link}
            to={target}
            localize={!external && !mediaLink}
            prefetch={external ? 'none' : 'intent'}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
          >
            {text}
          </CTAButton>
        )
      })}
    </div>
  )
}
