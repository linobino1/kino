import express from "express";
import compression from "compression";
import morgan from "morgan";
import sourceMapSupport from "source-map-support";
import payload from "payload";
import invariant from "tiny-invariant";

import { createRequestHandler } from "@remix-run/express";

import { themoviedb } from "./cms/MigrateMovie/tmdb";

// patch in Remix runtime globals
require("dotenv").config();
sourceMapSupport.install();

async function start() {
  const app = express();

  const vite =
    process.env.NODE_ENV === "production"
      ? undefined
      : await import("vite").then(({ createServer }) =>
          createServer({
            server: {
              middlewareMode: true,
            },
          })
        );

  // Start Payload CMS
  invariant(process.env.PAYLOAD_SECRET, "PAYLOAD_SECRET is required");
  invariant(process.env.PAYLOAD_SECRET, "PAYLOAD_SECRET is required");
  invariant(process.env.THEMOVIEDB_API_KEY, "THEMOVIEDB_API_KEY is required");

  app.use(payload.authenticate);

  // init themoviedb api
  themoviedb.defaults.params = {
    api_key: process.env.THEMOVIEDB_API_KEY,
  };

  // Express Server setup
  app.use(compression());

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable("x-powered-by");

  // Remix fingerprints its assets so we can cache forever.
  app.use(
    "/build",
    express.static("public/build", { immutable: true, maxAge: "1y" })
  );
  app.use(express.static("build/client", { maxAge: "1h" }));

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

  // handle Remix asset requests
  if (vite) {
    app.use(vite.middlewares);
  } else {
    app.use(
      "/assets",
      express.static("build/client/assets", { immutable: true, maxAge: "1y" })
    );
  }

  app.use(express.json());

  // handle Remix SSR requests
  app.all(
    "*",
    createRequestHandler({
      // @ts-ignore
      build: vite
        ? () => vite.ssrLoadModule("virtual:remix/server-build")
        : // @ts-ignore-error
          await import("./build/server/index.js"),
      getLoadContext(req, res) {
        return {
          payload: req.payload,
          user: req?.user,
          res,
        };
      },
    })
  );

  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log("Express server listening on http://localhost:" + port)
  );
}

start();
