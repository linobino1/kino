/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

import type { User } from "payload/generated-types";
import type { Response, Request, NextFunction } from "express";
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
  res: Response
) => Promise<AppLoadContext> | AppLoadContext;
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

declare module "@remix-run/express" {
  export function createRequestHandler({
    build,
    getLoadContext,
    mode,
  }: {
    build: ServerBuild | (() => Promise<ServerBuild>);
    getLoadContext?: GetLoadContextFunction;
    mode?: string;
  }): RequestHandler;
}

declare global {
  interface AppEnvironment {
    NODE_ENV: string;
    PAYLOAD_PUBLIC_SERVER_URL: string;
    HCAPTCHA_SITE_KEY: string;
    HCAPTCHA_SECRET_KEY: string;
    THEMOVIEDB_API_KEY: string;
    TIMEZONE: string;
    S3_ENABLED: string;
    S3_ENDPOINT: string;
    S3_BUCKET: string;
    S3_REGION: string;
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    MEDIA_URL: string;
    CDN_CGI_IMAGE_URL: string;
    MAILCHIMP_SIGNUP_URL: string;
    SENTRY_DSN: string;
    SENTRY_RELEASE: string;
    BUILD_NUMBER: string;
  }
  interface Window {
    ENV: AppEnvironment;
  }
  namespace NodeJS {
    interface ProcessEnv extends AppEnvironment {}
  }
}
