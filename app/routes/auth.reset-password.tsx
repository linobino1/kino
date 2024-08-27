import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import classes from "./auth.module.css";
import i18next from "~/i18next.server";
import { Link } from "~/components/localized-link";

// i18n namespace
const ns = "auth";

export const action = async ({
  request,
  context: { payload },
}: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const form = await request.formData();
  const t = await i18next.getFixedT(request, ns);

  try {
    await payload.resetPassword({
      collection: "users",
      overrideAccess: false,
      data: {
        password: form.get("password") as string,
        token: url.searchParams.get("token") ?? "",
      },
    });
  } catch (err) {
    return json({
      success: false,
      message: t(
        "either your password reset token or the new password is invalid"
      ),
    });
  }

  return json({
    success: true,
    message: t("your new password has been saved!"),
  });
};

export default function VerifyEmail() {
  const data = useActionData<typeof action>();
  const { t } = useTranslation(ns);

  return (
    <>
      <h1>{t("reset your password")}</h1>
      {data?.message && <p>{data.message}</p>}
      {data?.success ? (
        <nav className={classes.nav}>
          <Link to="/auth/signin">{t("sign in")}</Link>
        </nav>
      ) : (
        <Form method="POST" className={classes.form}>
          <label>
            {t("your new password")}
            <input type="password" name="password" />
          </label>

          <button type="submit">{t("submit")}</button>
        </Form>
      )}
    </>
  );
}
