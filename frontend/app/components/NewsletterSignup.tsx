import { useFetcher } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { type HTMLAttributes, useRef, useState, useEffect } from 'react'
import type { action } from '~/routes/newsletter-signup'
import Turnstile from 'react-turnstile'
import { classes } from '~/classes'

export type Props = HTMLAttributes<HTMLDivElement>

const NewsletterSignup: React.FC<Props> = ({ className, ...props }) => {
  const { t } = useTranslation()
  const [key, setKey] = useState<string>(() => Math.random().toString())
  function reset() {
    setKey(Math.random().toString())
    formRef.current?.reset()
  }
  const fetcher = useFetcher<typeof action>({ key })
  const formRef = useRef<HTMLFormElement | null>(null)

  const [captchaState, setCaptchaState] = useState<'checking' | 'verified' | 'error'>('checking')

  // wake up listmonk when the user interacts with the form
  const [isActive, setIsActive] = useState(false)
  const [triggeredWakeUp, setTriggeredWakeUp] = useState(false)
  useEffect(() => {
    if (!triggeredWakeUp && isActive) {
      fetch('/listmonk-wakeup', { method: 'post' })
      setTriggeredWakeUp(true)
    }
  }, [isActive, triggeredWakeUp])

  return (
    <div {...props} className={[classes.container, className].filter(Boolean).join(' ')}>
      <div className={classes.title}>{t('newsletter.cta')}</div>
      {fetcher.data?.success ? (
        <div className={classes.success}>
          <p>{t('newsletter.success')}</p>
          <button type="button" onClick={reset}>
            {t('newsletter.subscribeAgain')}
          </button>
        </div>
      ) : (
        <fetcher.Form
          ref={formRef}
          action="/newsletter-signup"
          method="post"
          className={classes.form}
        >
          <label htmlFor="name">{t('newsletter.name')}</label>
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="name"
            placeholder={t('newsletter.name')}
            onFocus={() => setIsActive(true)}
            required
          />
          <label htmlFor="email">{t('newsletter.email')}</label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            placeholder={t('newsletter.email')}
            required
          />
          {isActive && (
            <>
              <Turnstile
                sitekey={process.env.TURNSTILE_SITE_KEY}
                execution="render"
                onVerify={() => setCaptchaState('verified')}
                onError={() => setCaptchaState('error')}
              />
              <p className={classes.captcha}>
                {captchaState === 'checking' && t('newsletter.captcha.checking')}
                {captchaState === 'verified' && t('newsletter.captcha.success')}
                {captchaState === 'error' && t('newsletter.captcha.error')}
              </p>
            </>
          )}
          {fetcher.data && (
            <p
              className={[classes.message, !fetcher.data.success && classes.error]
                .filter(Boolean)
                .join(' ')}
            >
              {fetcher.data.message}
            </p>
          )}
          <button type="submit" disabled={isActive && captchaState !== 'verified'}>
            {fetcher.state === 'idle' ? t('newsletter.subscribe') : t('newsletter.sending')}
          </button>
        </fetcher.Form>
      )}
    </div>
  )
}

export default NewsletterSignup
