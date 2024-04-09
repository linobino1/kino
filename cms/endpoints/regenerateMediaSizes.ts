import type { PayloadHandler } from "payload/config";

import { mediaRegenerate } from "../scripts/mediaRegenerate";

export const regenerateMediaSizes: PayloadHandler = async (
  req,
  res
): Promise<void> => {
  const { user, payload } = req;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = new URLSearchParams(
    new URL(req.url, "http://unused.com").search
  );

  const page = params.get("page")
    ? parseInt(params.get("page") as string)
    : undefined;
  const limit = params.get("limit")
    ? parseInt(params.get("limit") as string)
    : undefined;

  try {
    await mediaRegenerate(payload, page, limit);
    res.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    payload.logger.error(message);
    res.json({ error: message });
  }
};
