import React from "react";
import type { AfterOperationHook } from "payload/dist/collections/config/types";
import type { Mailing } from "payload/generated-types";
import { extractTokenFromRequest } from "../../../util/extractTokenFromRequest";
import Newsletter from "../templates/Newsletter";
import { render } from "@react-email/components";

export const generateHTML: AfterOperationHook = async ({
  operation,
  req,
  result,
}) => {
  if (!["create", "update", "updateByID"].includes(operation)) {
    return result;
  }

  const token = extractTokenFromRequest(req);
  const response = await fetch(
    `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/mailings/${result.id}?depth=4`,
    {
      credentials: "include",
      headers: { cookie: `payload-token=${token}` },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch mailing details");
  }

  const mailing: Mailing = await response.json();

  result.html = render(<Newsletter mailing={mailing} />);

  return result;
};
