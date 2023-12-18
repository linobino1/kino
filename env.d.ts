/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

import type { User } from "payload/generated-types";
import type { Response } from "express";
import type { Payload } from "payload";
import type { ServerBuild } from "@remix-run/node";

export interface RemixRequestContext {
  payload: Payload;
  user?: User;
  token?: string;
  exp?: number;
  res: Response;
}

declare module "@remix-run/node" {
  interface AppLoadContext extends RemixRequestContext {}
}

//overload the request handler to include the payload and user objects
interface PayloadRequest extends Express.Request {
  payload: Payload;
  user?: User;
}

type GetLoadContextFunction = (
  req: PayloadRequest,
  res: express.Response
) => Promise<AppLoadContext> | AppLoadContext;
type RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<void>;

declare module "@remix-run/express" {
  export declare function createRequestHandler({
    build,
    getLoadContext,
    mode,
  }: {
    build: ServerBuild;
    getLoadContext?: GetLoadContextFunction;
    mode?: string;
  }): RequestHandler;
}

declare global {
  interface WindowENV {
    HCAPTCHA_SITE_KEY: string;
  }
  interface ServerENV extends WindowENV {
    NODE_ENV: "development" | "production";
    PAYLOAD_PUBLIC_SERVER_URL: string;
    HCAPTCHA_SECRET_KEY: string;
    THEMOVIEDB_API_KEY: string;
    TIMEZONE: string;
    S3_ENABLED: string;
    S3_BUCKET: string;
    S3_REGION: string;
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    MEDIA_URL: string;
    MAILCHIMP_SIGNUP_URL: string;
  }
  namespace NodeJS {
    interface ProcessEnv extends ServerENV {}
  }

  var env: WindowENV;
}
