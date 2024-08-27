import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import classes from "./auth.module.css";
import i18next from "~/i18next.server";
import { Link } from "~/components/localized-link";

// i18n namespace
const ns = "auth";

export const loader = async ({
  request,
  context: { payload },
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const t = await i18next.getFixedT(request, ns);

  try {
    await payload.verifyEmail({
      collection: "users",
      token: url.searchParams.get("token") ?? "",
    });
  } catch (err) {
    return json({
      success: false,
      message: t("your email address could not be verified"),
    });
  }

  return json({
    success: true,
    message: t("your email address has been verified!"),
  });
};

export default function VerifyEmail() {
  const data = useLoaderData<typeof loader>();
  const { t } = useTranslation(ns);

  return (
    <>
      <h1>{data.message}</h1>
      {data.success && (
        <nav className={classes.nav}>
          <Link to="/auth/signin">{t("sign in")}</Link>
        </nav>
      )}
    </>
  );
}
