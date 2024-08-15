import React from "react";
import type { FieldHook } from "payload/types";
import type { Mailing } from "payload/generated-types";
import { extractTokenFromRequest } from "../../../util/extractTokenFromRequest";
import Newsletter from "../templates/Newsletter";
import { render } from "@react-email/components";

export const generateHTML: FieldHook = async ({ originalDoc, req }) => {
  if (!originalDoc) {
    return;
  }

  const token = extractTokenFromRequest(req);
  const res = await fetch(
    `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/mailings/${originalDoc.id}?depth=4`,
    {
      credentials: "include",
      headers: { cookie: `payload-token=${token}` },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch mailing details");
  }

  const mailing: Mailing = await res.json();

  return render(<Newsletter mailing={mailing} />);
};
