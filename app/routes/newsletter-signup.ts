import { json, type ActionFunction } from "@remix-run/node";
import i18next from "~/i18next.server";

const validateCaptcha = async (token: string): Promise<boolean> => {
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY,
          sitekey: process.env.TURNSTILE_SITE_KEY,
          response: token,
        }),
      }
    );
    const data = await res.json();
    return !!data.success;
  } catch (error) {
    return false;
  }
};

export const action: ActionFunction = async ({ request }) => {
  const t = await i18next.getFixedT(request);
  const data = await request.formData();

  // validate captcha
  if (!(await validateCaptcha(data.get("cf-turnstile-response") as string))) {
    return json({
      success: false,
      message: `The humanity checks could not be validated on the server. Sorry, please try again.`,
    });
  }

  let res = await fetch(`${process.env.LISTMONK_URL}/api/public/subscription`, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      email: data.get("email"),
      name: data.get("name"),
      list_uuids: [process.env.LISTMONK_LIST_ID],
    }),
  });

  if (res.ok) {
    return json({
      success: true,
      message: t("newsletter.success"),
      original_response: res.json(),
    });
  } else {
    return json({
      success: false,
      // message: `We couldn't sign you up. Please try again.`,
      message: t("newsletter.error.unknown"),
      original_response: res.json(),
    });
  }
};
