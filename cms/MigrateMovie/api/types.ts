import type { Payload } from "payload";
import type { Movie } from "payload/generated-types";
import type {
  tmdbImages,
  tmdbMovie,
} from "../tmdb/types";

export interface PreviewBody {
  tmdbId: number;
  locale: string;
}

export interface tmdbPreview extends tmdbMovie {
  images: tmdbImages;
}

export interface MigrateBody extends PreviewBody {
  images: {
    poster: string;
    backdrop: string;
  };
}

export interface MigrateResult {
  movie: Movie;
  warnings: Error[];
}

export interface MigrateFunction {
  (
    body: MigrateBody,
    payload: Payload
  ): Promise<MigrateResult>;
}