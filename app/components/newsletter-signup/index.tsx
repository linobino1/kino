import { Form } from "@remix-run/react";
import { useFormFields, useMailChimpForm } from "use-mailchimp-form";
import classes from "./index.module.css";
import { useTranslation } from "react-i18next";
import environment from "~/util/environment";
import { type HTMLAttributes } from "react";

export interface Props extends HTMLAttributes<HTMLDivElement> {}

const NewsletterSignup: React.FC<Props> = ({ className, ...props }) => {
  const { t } = useTranslation();
  const url = environment().MAILCHIMP_SIGNUP_URL;
  const { loading, error, success, message, handleSubmit, reset } =
    useMailChimpForm(url);
  const { fields, handleFieldChange } = useFormFields({
    EMAIL: "",
    FNAME: "",
    LNAME: "",
  });

  return (
    <div
      {...props}
      className={[classes.container, className].filter(Boolean).join(" ")}
    >
      <div className={classes.title}>{t("newsletter.cta")}</div>
      {success && (
        <div className={classes.success}>
          <p>{t("newsletter.success")}</p>
          <button type="button" onClick={reset}>
            {t("newsletter.subscribeAgain")}
          </button>
        </div>
      )}
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(fields);
        }}
        className={[classes.form, success && classes.hidden].join(" ")}
      >
        <label htmlFor="FNAME">{t("newsletter.firstName")}</label>
        <input
          type="text"
          name="FNAME"
          id="FNAME"
          autoComplete="given-name"
          value={fields.FNAME}
          onChange={handleFieldChange}
          placeholder={t("newsletter.firstName")}
          required
        />
        <label htmlFor="LNAME">{t("newsletter.lastName")}</label>
        <input
          type="text"
          name="LNAME"
          id="LNAME"
          autoComplete="family-name"
          value={fields.LNAME}
          onChange={handleFieldChange}
          placeholder={t("newsletter.lastName")}
          required
        />
        <label htmlFor="EMAIL">{t("newsletter.email")}</label>
        <input
          type="email"
          name="EMAIL"
          id="EMAIL"
          autoComplete="email"
          value={fields.EMAIL}
          onChange={handleFieldChange}
          placeholder={t("newsletter.email")}
          required
        />
        {error && <p className={classes.error}>{error}</p>}
        {message && <p>{message}</p>}
        <button type="submit">
          {loading ? t("newsletter.sending") : t("newsletter.subscribe")}
        </button>
      </Form>
    </div>
  );
};

export default NewsletterSignup;
