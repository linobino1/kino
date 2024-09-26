import React from "react";
import { extractTokenFromRequest } from "../../../util/extractTokenFromRequest";
import Newsletter, {
  type Props as NewsletterProps,
} from "../templates/Newsletter";
import { render } from "@react-email/components";
import type { FieldHook } from "payload/types";
import { addDepth } from "../lexical/addDepth";

export const generateHTML: FieldHook = async ({ data, req }) => {
  if (!data) {
    return;
  }

  // it would be nice if we could fetch the whole mailing doc here with more depth, but this will not work on create
  // const id = data.id;
  // const token = extractTokenFromRequest(req);
  // const response = await fetch(
  //   `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/mailings/${result.id}?depth=4`,
  // );

  // let's add depth to the lexical content
  const content = await addDepth({
    json: data.content,
    payload: req.payload,
    locale: "de",
  });

  // and fetch the header and footer images
  const fetchOptions: RequestInit = {
    credentials: "include",
    headers: {
      cookie: `payload-token=${extractTokenFromRequest(req)}`,
    },
  };
  const [headerImage, headerOverlay, footerImage] = await Promise.all([
    // header image (if set)
    data.header.image &&
      fetch(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/media/${data.header.image}`,
        fetchOptions
      ).then((res) => res.json()),
    // header overlay (if set)
    data.header.overlay &&
      fetch(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/media/${data.header.overlay}`,
        fetchOptions
      ).then((res) => res.json()),
    // footer image (if set)
    data.footer.image &&
      fetch(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/media/${data.footer.image}`,
        fetchOptions
      ).then((res) => res.json()),
  ]);

  // assemble the "deep" mailing doc
  const mailing: NewsletterProps["mailing"] = {
    ...data,
    // @ts-ignore why is SerializedLexicalEditorState not assignable to SerializedLexicalEditorState?
    content,
    header: {
      ...data?.header,
      image: headerImage,
      overlay: headerOverlay,
    },
    footer: {
      ...data?.footer,
      image: footerImage,
    },
    subject: data.subject,
  };

  // console.log("mailing", JSON.stringify(mailing, null, 2));

  return await render(<Newsletter mailing={mailing} />);
};
