import React from 'react'
import { useMatches } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import type { User } from '@app/types/payload'
import { Link } from '~/components/localized-link'
import { cn } from '~/util/cn'
import { useEnv } from '~/util/useEnv'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const UserStatus: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation()
  const rootData = useMatches().find((match) => match.id === 'root')?.data as any
  const user = rootData?.user as User | undefined
  const env = useEnv()

  return (
    <div className={cn('', className)}>
      {user ? (
        <div className="flex flex-col gap-1 whitespace-nowrap text-center lowercase">
          <Link to="/auth/me" className="hover:text-black">
            {t('signed in as {{name}}', { name: user.name })}
          </Link>
          <Link
            to={env?.BACKEND_URL ?? ''}
            target="_blank"
            localize={false}
            className="hover:text-black"
          >
            {t('backend')} →
          </Link>
        </div>
      ) : (
        <Link to="/auth/signin" className="whitespace-nowrap hover:text-black">
          {t('Sign In')}
        </Link>
      )}
    </div>
  )
}
