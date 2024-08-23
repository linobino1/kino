import fs from "fs";

export const downloadFile = async (url: string, path: string) => {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to download file from ${url}`);
  }

  const body = await resp.body;

  if (!body) {
    throw new Error("No body in response");
  }

  const download_write_stream = fs.createWriteStream(path);

  const stream = new WritableStream({
    write(chunk) {
      download_write_stream.write(chunk);
    },
  });

  await body.pipeTo(stream);
};
