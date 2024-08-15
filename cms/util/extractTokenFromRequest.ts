import { parse } from "cookie-es";
import type { PayloadRequest } from "payload/types";

export const extractTokenFromRequest = (request: PayloadRequest) => {
  const cookie = parse(request.headers.cookie || "");
  return cookie["payload-token"];
};
