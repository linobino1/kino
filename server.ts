import path from "path";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import payload from "payload";
import { createRequestHandler } from "@remix-run/express";
import invariant from "tiny-invariant";
import { sender, transport } from "./email";
import { themoviedb } from "./cms/MigrateMovie/tmdb";
import { broadcastDevReady } from "@remix-run/node";

require("dotenv").config();

const BUILD_DIR = path.join(process.cwd(), "build");

start();

async function start() {
  const app = express();

  invariant(process.env.PAYLOAD_SECRET, "PAYLOAD_SECRET is required");
  invariant(process.env.THEMOVIEDB_API_KEY, "THEMOVIEDB_API_KEY is required");

  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    email: {
      fromName: sender.name,
      fromAddress: sender.address,
      transport,
    },
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // init themoviedb api
  themoviedb.defaults.params = {
    api_key: process.env.THEMOVIEDB_API_KEY,
  };

  app.use(compression());

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable("x-powered-by");

  // Remix fingerprints its assets so we can cache forever.
  app.use(
    "/build",
    express.static("public/build", { immutable: true, maxAge: "1y" })
  );

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static("public", { maxAge: "1h" }));

  app.use(morgan("tiny"));

  // robots.txt
  app.get("/robots.txt", function (req, res) {
    res.type("text/plain");
    res.send(
      `User-agent: *\nDisallow:${
        process.env.NODE_ENV === "development" ? " *" : ""
      }:`
    );
  });

  app.use(express.json());

  // authenticate all requests to the frontend
  app.use(payload.authenticate);

  const build = require(BUILD_DIR);

  app.all(
    "*",
    process.env.NODE_ENV === "development"
      ? (req, res, next) => {
          purgeRequireCache();

          return createRequestHandler({
            build,
            mode: process.env.NODE_ENV,
            getLoadContext(req, res) {
              return {
                // @ts-expect-error
                payload: req.payload,
                // @ts-expect-error
                user: req?.user,
                res,
              };
            },
          })(req, res, next);
        }
      : createRequestHandler({
          build,
          mode: process.env.NODE_ENV,
          getLoadContext(req, res) {
            return {
              // @ts-expect-error
              payload: req.payload,
              // @ts-expect-error
              user: req?.user,
              res,
            };
          },
        })
  );
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
    if (process.env.NODE_ENV === "development") {
      broadcastDevReady(build);
    }
  });
}

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
