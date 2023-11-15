import type { Payload } from "payload";
import type { Movie } from "payload/generated-types";
import type { tmdbImages, tmdbMovie } from "../tmdb/types";

export interface PreviewBody {
  tmdbId: number;
  locale: string;
}

export interface tmdbPreviewResult {
  movie: tmdbMovie;
  images: tmdbImages;
}

export interface tmdbFindResult {
  results: Array<tmdbMovie>;
}
export interface FindFunction {
  (args: { payload: Payload; query: string }): Promise<tmdbFindResult>;
}

export interface PreviewFunction {
  (
    args: {
      payload: Payload;
    } & PreviewBody
  ): Promise<tmdbPreviewResult>;
}

export type MigratedMovie = Partial<Movie> & Pick<Movie, "id" | "tmdbId">;

export interface MigrateFunction {
  (args: {
    images: {
      poster: string;
      backdrop: string;
    };
    payload: Payload;
    tmdbId: number;
  }): Promise<{
    movie: MigratedMovie;
    warnings: Error[];
  }>;
}

export type Endpoint =
  | "movie"
  | "credits"
  | "videos"
  | "keywords"
  | "releaseDates"
  | "images";

export interface MigrationFunction {
  (context: {
    payload: Payload;
    movie: Partial<Movie> & Pick<Movie, "id" | "tmdbId">;
    warnings: Error[];
  }): Promise<void>;
}
