import { useFetcher } from "@remix-run/react";
import classes from "./index.module.css";
import { useTranslation } from "react-i18next";
import { type HTMLAttributes, useRef, useState } from "react";
import type { action } from "~/routes/newsletter-signup";

export interface Props extends HTMLAttributes<HTMLDivElement> {}

const NewsletterSignup: React.FC<Props> = ({ className, ...props }) => {
  const { t } = useTranslation();
  let [key, setKey] = useState<string>(() => Math.random().toString());
  function reset() {
    setKey(Math.random().toString());
    formRef.current?.reset();
  }
  const fetcher = useFetcher<typeof action>({ key });
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <div
      {...props}
      className={[classes.container, className].filter(Boolean).join(" ")}
    >
      <div className={classes.title}>{t("newsletter.cta")}</div>
      {fetcher.data?.success ? (
        <div className={classes.success}>
          <p>{t("newsletter.success")}</p>
          <button type="button" onClick={reset}>
            {t("newsletter.subscribeAgain")}
          </button>
        </div>
      ) : (
        <fetcher.Form
          ref={formRef}
          action="/newsletter-signup"
          method="post"
          className={classes.form}
        >
          <label htmlFor="name">{t("newsletter.name")}</label>
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="name"
            placeholder={t("newsletter.name")}
            required
          />
          <label htmlFor="email">{t("newsletter.email")}</label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            placeholder={t("newsletter.email")}
            required
          />
          {fetcher.data && (
            <p
              className={[
                classes.message,
                !fetcher.data.success && classes.error,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {fetcher.data.message}
            </p>
          )}
          <button type="submit">
            {fetcher.state === "idle"
              ? t("newsletter.subscribe")
              : t("newsletter.sending")}
          </button>
        </fetcher.Form>
      )}
    </div>
  );
};

export default NewsletterSignup;
