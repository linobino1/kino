import { Form, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import classes from "./auth.module.css";
import i18next from "~/i18next.server";

// i18n namespace
const ns = "auth";
export const handle = { i18n: "auth" };

export const action = async ({
  request,
  context: { payload },
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const t = await i18next.getFixedT(request, ns);

  // create user
  try {
    await payload.create({
      collection: "users",
      data: {
        email: form.get("email") as string,
        name: form.get("name") as string,
        password: form.get("password") as string,
      },
      overrideAccess: false,
    });
  } catch (err) {
    return json({
      success: false,
      message: t("could not create account, maybe you are already registered?"),
    });
  }

  return json({
    success: true,
    message: t("your account has been created, please check your inbox now"),
  });
};

export default function SignUp() {
  const data = useActionData<typeof action>();
  const { t } = useTranslation(ns);

  return (
    <>
      <h1>{t("sign up")}</h1>
      {data?.message && <p>{data.message}</p>}
      {!data?.success && (
        <Form method="POST" className={classes.form}>
          <label>
            {t("name")}
            <input type="name" name="name" />
          </label>

          <label>
            {t("email")}
            <input type="email" name="email" />
          </label>

          <label>
            {t("password")}
            <input type="password" name="password" />
          </label>

          <button type="submit">{t("sign up")}</button>
        </Form>
      )}
    </>
  );
}
