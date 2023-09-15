import type { Endpoint } from "payload/config";
import { migrate } from "./migrate";
import { preview } from "./preview";

const prefix = '/migrate-movie';

const checkAccess = (req: any, res: any) => {
  if (!['admin', 'editor'].find((role) => role === req?.user?.role)) {
    res.status(401).send('Unauthorized');
    throw new Error('Unauthorized');
  }
};

export const endpoints: Endpoint[]  = [
  {
    path: `${prefix}/preview`,
    method: 'post',
    handler: async (req, res) => {
      const { payload } = req;
      
      checkAccess(req, res);

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

      checkAccess(req, res);

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