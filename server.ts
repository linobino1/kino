import express from "express";
import compression from "compression";
import morgan from "morgan";
import payload from "payload";
import { createRequestHandler } from "@remix-run/express";
import invariant from "tiny-invariant";
import { sender, transport } from "./email";
import { themoviedb } from "./cms/MigrateMovie/tmdb";
import sourceMapSupport from "source-map-support";
import { unstable_viteServerBuildModuleId } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";

// patch in Remix runtime globals
installGlobals();
require("dotenv").config();
sourceMapSupport.install();

start();

async function start() {
  const app = express();

  invariant(process.env.PAYLOAD_SECRET, "PAYLOAD_SECRET is required");
  invariant(process.env.THEMOVIEDB_API_KEY, "THEMOVIEDB_API_KEY is required");

  const vite =
    process.env.NODE_ENV === "production"
      ? undefined
      : // @ts-ignore
        await import("vite").then(({ createServer }) =>
          createServer({
            server: {
              middlewareMode: true,
            },
          })
        );

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

  // authenticate all requests to the frontend
  app.use(payload.authenticate);

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

  // handle Remix asset requests
  if (vite) {
    app.use(vite.middlewares);
  } else {
    app.use(
      "/assets",
      express.static("build/client/assets", { immutable: true, maxAge: "1y" })
    );
  }

  app.use(express.static("build/client", { maxAge: "1h" }));

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

  // handle Remix SSR requests
  app.all(
    "*",
    createRequestHandler({
      build: vite
        ? () => vite.ssrLoadModule(unstable_viteServerBuildModuleId)
        : // @ts-ignore
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

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
}
