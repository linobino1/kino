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
        const data = await preview(req.body, payload);
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
        const data = await migrate(req.body, payload);
        res.status(200).send({ success: true, data });
        return
      } catch (error: any) {
        res.status(400).send({ success: false, message: error.message });
        return
      }
    },
  }
]