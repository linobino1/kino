import React from "react";
import { extractTokenFromRequest } from "../../../util/extractTokenFromRequest";
import Newsletter, {
  type Props as NewsletterProps,
} from "../templates/Newsletter";
import { render } from "@react-email/components";
import type { FieldHook } from "payload/types";

export const generateHTML: FieldHook = async ({ data, req }) => {
  if (!data) {
    return;
  }

  console.log("Generating HTML for mailing", data);

  // it would be nice if we could fetch the whole mailing doc here with more depth, but this will not work on create
  // const id = data.id;
  // const token = extractTokenFromRequest(req);
  // const response = await fetch(
  //   `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/mailings/${result.id}?depth=4`,
  // );

  // let's fetch the details we need...
  const fetchOptions: RequestInit = {
    credentials: "include",
    headers: {
      cookie: `payload-token=${extractTokenFromRequest(req)}`,
    },
  };
  const [headerImage, footerImage, screenings] = await Promise.all([
    // header image (if set)
    data.headerImage &&
      fetch(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/media/${data.headerImage}`,
        fetchOptions
      ).then((res) => res.json()),
    // footer image (if set)
    data.footer.image &&
      fetch(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/media/${data.footer.image}`,
        fetchOptions
      ).then((res) => res.json()),
    // screenings with depth 3
    Promise.all(
      data.screenings.map((item: any) =>
        fetch(
          `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/screenings/${item.screening}?depth=3`,
          fetchOptions
        ).then((res) => res.json())
      )
    ),
  ]);

  // assemble the "deep" mailing doc
  const mailing: NewsletterProps["mailing"] = {
    ...data,
    headerImage,
    footer: {
      ...data?.footer,
      image: footerImage,
    },
    screenings: data.screenings.map((item: any, index: number) => ({
      ...item,
      screening: screenings[index],
    })),
  };

  return render(<Newsletter mailing={mailing} />);
};
