import type { action } from '~/routes/api/newsletter-signup'
import { useRef, useState, useEffect } from 'react'
import { useFetcher } from 'react-router'
import { useTranslation } from 'react-i18next'
import Turnstile from 'react-turnstile'
import { cn } from '@app/util/cn'
import Button from './Button'
import { useEnv } from '~/util/useEnv'

export type Props = React.HTMLAttributes<HTMLDivElement>

const input =
  'border border-gray-300 rounded p-[0.1em] focus:outline-none text-black focus:ring-2 focus:ring-blue focus:border-primary-500'

const NewsletterSignup: React.FC<Props> = ({ className, ...props }) => {
  const env = useEnv()
  const { t } = useTranslation()
  const [key, setKey] = useState<string>(() => Math.random().toString())
  function reset() {
    setKey(Math.random().toString())
    formRef.current?.reset()
  }
  const { Form, data, state } = useFetcher<typeof action>({ key })
  const formRef = useRef<HTMLFormElement | null>(null)

  const [captchaState, setCaptchaState] = useState<'checking' | 'verified' | 'error'>('checking')

  // wake up listmonk when the user interacts with the form
  const [isActive, setIsActive] = useState(false)
  const [triggeredWakeUp, setTriggeredWakeUp] = useState(false)
  useEffect(() => {
    if (!triggeredWakeUp && isActive) {
      fetch('/api/listmonk-wakeup', { method: 'post' })
      setTriggeredWakeUp(true)
    }
  }, [isActive, triggeredWakeUp])

  return (
    <div {...props} className={cn('min-h-[11em]', className)}>
      <div className="mb-3 font-semibold">{t('newsletter.cta')}</div>
      {data?.success ? (
        <div className="">
          <p>{t('newsletter.success')}</p>
          <Button onClick={reset}>{t('newsletter.subscribeAgain')}</Button>
        </div>
      ) : (
        <Form
          ref={formRef}
          action="/api/newsletter-signup"
          method="post"
          className="flex w-full flex-col gap-2"
        >
          <label htmlFor="name" className="sr-only">
            {t('newsletter.name')}
          </label>
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="name"
            placeholder={t('newsletter.name')}
            onFocus={() => setIsActive(true)}
            required
            className={input}
          />
          <label htmlFor="email" className="sr-only">
            {t('newsletter.email')}
          </label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            placeholder={t('newsletter.email')}
            required
            className={input}
          />
          {isActive && (
            <>
              <Turnstile
                sitekey={env?.TURNSTILE_SITE_KEY ?? ''}
                execution="render"
                onVerify={() => setCaptchaState('verified')}
                onError={() => setCaptchaState('error')}
              />
              <p className="text-sm opacity-50">
                {captchaState === 'checking' && t('newsletter.captcha.checking')}
                {captchaState === 'verified' && t('newsletter.captcha.success')}
                {captchaState === 'error' && t('newsletter.captcha.error')}
              </p>
            </>
          )}
          {data && (
            <p className={cn('bg-white', { 'text-red-500': !data.success })}>{data.message}</p>
          )}
          <Button
            type="submit"
            disabled={isActive && captchaState !== 'verified'}
            className="my-2 w-full"
            look="white"
            size="sm"
          >
            {state === 'idle' ? t('newsletter.subscribe') : t('newsletter.sending')}
          </Button>
        </Form>
      )}
    </div>
  )
}

export default NewsletterSignup
