import { Form, useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { fetch } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import classes from "./index.module.css";
import i18next from "~/i18next.server";
import { validate } from "email-validator";

// i18n namespace
const ns = "auth";

export const action = async ({ request, context: { payload } }: ActionArgs) => {
  const form = await request.formData();
  const t = await i18next.getFixedT(request, ns);

  if (!validate(form.get("email") as string)) {
    return json({
      success: false,
      message: t("invalid email address given"),
    });
  }
  try {
    await payload.forgotPassword({
      collection: "users",
      data: {
        email: form.get("email") as string,
      },
    });
    return json({
      success: true,
      message: t("please check your inbox"),
    });
  } catch (err) {
    return json({
      success: false,
      message: t("invalid email address given"),
    });
  }
};

export default function ForgotPassword() {
  const data = useActionData<typeof action>();
  const { t } = useTranslation(ns);

  return (
    <>
      <h1>{t("reset your password")}</h1>
      {data && <p>{data.message}</p>}
      {!data?.success && (
        <Form method="post" className={classes.form}>
          {data && "error" in data && <p>{data.error as string}</p>}
          <label>
            {t("email")}
            <input type="email" name="email" />
          </label>

          <button type="submit">{t("submit")}</button>
        </Form>
      )}
    </>
  );
}
