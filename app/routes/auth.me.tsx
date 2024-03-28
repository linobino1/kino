import {
  json,
  redirect,
  type ActionFunctionArgs,
  type ActionFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import classes from "./auth.module.css";
import i18next from "~/i18next.server";

// i18n namespace
const ns = "auth";

/**
 * sign out user
 */
export const action: ActionFunction = async ({
  request,
  context: { payload, res },
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const t = await i18next.getFixedT(request, ns);

  switch (form.get("_action")) {
    case "signOut":
      res.clearCookie("payload-token");
      return redirect("/");

    case "deleteAccount":
      try {
        await payload.delete({
          collection: "users",
          id: form.get("id") as string,
        });
      } catch (err) {
        return json({
          action: form.get("_action"),
          success: false,
          message: t("could not delete your account"),
        });
      }
      return json({
        action: form.get("_action"),
        success: true,
        message: t("your account has been deleted"),
      });
  }
};

export const loader = ({ context: { user, res } }: LoaderFunctionArgs) => {
  if (!user) {
    res.redirect("/auth/signin");
  }
  return json({
    user,
  });
};

export default function Me() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { user } = loaderData;
  const { t } = useTranslation(ns);

  return (
    <>
      {actionData?.message && <p>{actionData.message as string}</p>}
      {user ? (
        <>
          {t("Signed in as {{user}}", { user: user.name })}
          <Form method="POST" className={classes.form}>
            <input type="hidden" name="id" value={user.id} />
            <button type="submit" name="_action" value="signOut">
              {t("sign out")}
            </button>
            <button type="submit" name="_action" value="deleteAccount">
              {t("delete my account")}
            </button>
          </Form>
        </>
      ) : (
        <nav className={classes.nav}>
          <Link to="/">{t("back")}</Link>
          <Link to="/auth/signin">{t("sign in")}</Link>
        </nav>
      )}
    </>
  );
}
