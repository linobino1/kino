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
