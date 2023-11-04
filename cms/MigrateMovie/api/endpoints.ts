import type { Endpoint } from "payload/config";
import type { PayloadRequest } from "payload/types";
import { migrate } from "./migrate";
import { preview } from "./preview";
import { findInTmdb } from "./helpers";

const prefix = '/migrate-movie';
  
const hasAccess = (req: PayloadRequest) => {
  return ['admin', 'editor'].find((role) => role === req?.user?.role);
};

export const endpoints: Endpoint[]  = [
  {
    path: `${prefix}/search`,
    method: 'post',
    handler: async (req, res) => {
      const { payload } = req;

      if (!hasAccess(req)) {
        res.status(401).send('Unauthorized');
        return
      }
      
      try {
        const data = await findInTmdb({
          payload,
          query: req.body.query,
        });
        res.status(200).send({ success: true, data });
      } catch (error: any) {
        res.status(400).send({ success: false, message: error.message });
      }
      return
    },
  },
  {
    path: `${prefix}/preview`,
    method: 'post',
    handler: async (req, res) => {
      const { payload } = req;

      if (!hasAccess(req)) {
        res.status(401).send('Unauthorized');
        return
      }
      
      try {
        const data = await preview({
          tmdbId: req.body.tmdbId,
          locale: req.body.locale,
          payload,
        });
        res.status(200).send({ success: true, data });
      } catch (error: any) {
        res.status(400).send({ success: false, message: error.message });
      }
      return
    },
  },
  {
    path: `${prefix}/migrate`,
    method: 'post',
    handler: async (req, res) => {
      const { payload } = req;

      if (!hasAccess(req)) {
        res.status(401).send('Unauthorized');
        return
      }

      try {
        const data = await migrate({
          tmdbId: req.body.tmdbId,
          payload,
          images: req.body.images,
        });
        res.status(200).send({ success: true, data: {
          movie: data.movie,
          warnings: data.warnings.map((warning) => warning.message),
        }});
        return
      } catch (error: any) {
        res.status(400).send({ success: false, message: error.message });
        return
      }
    },
  }
]