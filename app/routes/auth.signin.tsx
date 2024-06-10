import { Form, Link, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import classes from "./auth.module.css";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";

// i18n namespace
const ns = "auth";

export const action = async ({
  request,
  context: { payload, res },
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const t = await i18next.getFixedT(request, ns);

  try {
    await payload.login({
      collection: "users",
      data: {
        email: form.get("email") as string,
        password: form.get("password") as string,
      },
      res,
      overrideAccess: false,
    });
    return redirect("/");
  } catch (err) {
    return json({
      error: t("email and/or password invalid"),
    });
  }
};

export default function SignIn() {
  const actionData = useActionData<typeof action>();
  const { t } = useTranslation(ns);

  return (
    <>
      <h1>{t("sign in")}</h1>
      <Form method="POST" className={classes.form}>
        {actionData?.error && <p>{actionData.error}</p>}
        <label>
          {t("email")}
          <input type="email" name="email" />
        </label>

        <label>
          {t("password")}
          <input type="password" name="password" />
        </label>

        <button type="submit">{t("sign in")}</button>
      </Form>
      <nav className={classes.nav}>
        <Link to="/auth/forgot-password">{t("forgot password?")}</Link>
        <Link to="/auth/signup">{t("sign up")}</Link>
      </nav>
    </>
  );
}
