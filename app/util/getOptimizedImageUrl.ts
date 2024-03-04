import environment from "./environment";

const defaultOptions = {
  quality: 85,
  format: "auto",
};

/**
 * this function is used to get the optimized image url from cloudflare
 * @param url origin url of the image
 * @param options cloudflare transformation options
 * @returns url to /cgi-bin/image with cloudflare transformation options
 */
export const getOptimizedImageUrl = (url: string, options: object) => {
  // image optimization is not available in development
  if (process.env.NODE_ENV === "development") {
    return url;
  }

  // merge options with default options
  options = { ...defaultOptions, ...options };
  const optionsString = Object.entries(options)
    .map(([key, value]) => `${key}=${value}`)
    .join(",");

  // construct the url
  return `${environment().CDN_CGI_IMAGE_URL}/${optionsString}/${encodeURI(
    url
  )}`;
};

export default getOptimizedImageUrl;
