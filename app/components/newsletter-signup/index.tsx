import React from 'react';
import Mailchimp from "react-mailchimp-form";
import classes from './index.module.css';
import environment from '~/util/environment';
import { useTranslation } from 'react-i18next';

export type Props = {
  className?: string;
}

export const NewsletterSignup: React.FC<Props> = ({ className }) => {
  const url = environment().MAILCHIMP_SIGNUP_URL;
  const { t } = useTranslation();
  
  return (
    <div className={`${classes.container} ${className}`}>
      <div className={classes.title}>{t("newsletter.title")}</div>
      <Mailchimp
        className={classes.form}
        action={url}
        fields={[
          {
            name: 'EMAIL',
            placeholder: t("newsletter.placeholder"),
            type: 'email',
            required: true
          }
        ]}
        messages = {
          {
            sending: t("newsletter.sending"),
            success: t("newsletter.success"),
            error: t("newsletter.error"),
            empty: t("newsletter.empty"),
            duplicate: t("newsletter.duplicate"),
            button: 'OK',
          }
        }
      />
    </div>
);
}
  
export default NewsletterSignup;
  