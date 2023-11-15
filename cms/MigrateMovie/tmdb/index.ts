import { Axios } from "axios";

export const tmdbMediaUrl = "https://image.tmdb.org";

/**
 *  default language of themoviedb.org API, must be one of the languages in
 *  config.i18n.locales
 */
export const tmdbLng = "en";

export const themoviedb = new Axios({
  baseURL: "https://api.themoviedb.org/3",
});
