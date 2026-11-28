import { useTranslation } from 'react-i18next'
import { CTAButton } from '~/components/CTAButton'
import type { ButtonIconName } from '~/components/ButtonIcon'
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

const targetByType: Record<
  NonNullable<AttachedLink['type']>,
  (link: AttachedLink) => string
> = {
  event: ({ event }) =>
    typeof event === 'object' && event ? eventHref(event.slug) : '',
  programme: ({ programme }) =>
    typeof programme === 'object' && programme ? (programme.url ?? '') : '',
  download: ({ download }) =>
    typeof download === 'object' && download ? (download.url ?? '') : '',
  trailer: ({ url }) => url ?? '',
  custom: ({ url }) => url ?? '',
}

const iconByType: Partial<
  Record<NonNullable<AttachedLink['type']>, ButtonIconName>
> = {
  programme: 'arrow',
  download: 'download',
  trailer: 'play',
  event: 'arrow',
}

export const AttachedLinks: React.FC<Props> = ({ links }) => {
  const { t } = useTranslation()
  const textByType: Record<
    NonNullable<AttachedLink['type']>,
    (label: string | null | undefined, target: string) => string
  > = {
    programme: () => t('links.programme'),
    download: () => t('links.download'),
    trailer: () => t('links.trailer'),
    event: () => t('links.event'),
    custom: (label, target) => label?.trim() || displayUrl(target),
  }
  const validLinks =
    links?.flatMap((link) => {
      const target = link.type ? targetByType[link.type](link) : (link.url ?? '')
      return target ? [{ ...link, target }] : []
    }) ?? []

  if (!validLinks.length) return null

  return (
    <div className="flex flex-wrap gap-3">
      {validLinks.map(({ id, type, target, label }, index) => {
        const external = /^(https?:)?\/\//i.test(target)
        const mediaLink = type === 'programme' || type === 'download'
        let text = displayUrl(target)
        if (type) text = textByType[type](label, target)
        const icon = (type && iconByType[type]) || (external ? 'external' : undefined)

        return (
          <CTAButton
            key={id ?? `${type}-${target}-${index}`}
            as={Link}
            to={target}
            localize={!external && !mediaLink}
            prefetch={external ? 'none' : 'intent'}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            icon={icon}
          >
            {text}
          </CTAButton>
        )
      })}
    </div>
  )
}
