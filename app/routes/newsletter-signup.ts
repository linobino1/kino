import { json, type ActionFunction } from "@remix-run/node";
import i18next from "~/i18next.server";

export const action: ActionFunction = async ({ request }) => {
  const t = await i18next.getFixedT(request);
  const data = await request.formData();

  // wake listmonk up, otherwise the first request will fail
  await fetch(`${process.env.LISTMONK_API_ENDPOINT}`, {
    method: "head",
  });
  await new Promise((resolve) => setTimeout(resolve, 500));

  let res;
  try {
    res = await fetch(
      `${process.env.LISTMONK_API_ENDPOINT}/public/subscription`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          email: data.get("email"),
          name: data.get("name"),
          list_uuids: [process.env.LISTMONK_LIST_ID],
        }),
      }
    );
  } catch (error) {}

  if (!res?.ok) {
    if (!res || res.status === 404) {
      return json(
        {
          success: false,
          message: t("newsletter.error.network"),
        },
        { status: 404 }
      );
    }

    return json(
      {
        success: false,
        message: t("newsletter.error.unknown"),
      },
      { status: 400 }
    );
  }

  return json(
    {
      success: true,
      message: `Thanks for signing up! Check your inbox/spam for an email with the confirmation link.`,
    },
    { status: 200 }
  );
};
