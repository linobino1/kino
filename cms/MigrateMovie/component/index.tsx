import React, { useEffect, useRef, useState } from "react";
import { useLocale } from "payload/components/utilities";
import "./index.scss";
import type { Movie } from "payload/generated-types";
import type { tmdbFindResult, tmdbPreviewResult } from "../api/types";
import { useTranslation } from "react-i18next";

export const MigrateMovie: React.FC = () => {
  const locale = useLocale();
  const { t } = useTranslation();
  // states:
  // initial: show search input
  // loading: show loading
  // results: show results of tmdb find
  // preview: show preview of movie with form to select backdrop and poster image
  // success: show success message and link to the created movie
  const [state, setState] = useState<string>("initial");
  const [error, setError] = useState<string>("");
  const [warnings, setWarnings] = useState<[]>([]);
  const [query, setQuery] = useState<string>("");
  const [tmdbId, setTmdbId] = useState<string>("");
  const [images, setImages] = useState<{
    backdrop?: string;
    poster?: string;
  }>({
    backdrop: undefined,
    poster: undefined,
  });
  const [searchResults, setSearchResults] = useState<tmdbFindResult>();
  const [previewData, setPreviewData] = useState<tmdbPreviewResult>();
  const [migratedMovie, setMigratedMovie] = useState<Movie>();
  const success = useRef<HTMLDivElement>(null);
  const loading = useRef<HTMLDivElement>(null);

  const cancel = () => {
    setState("initial");
    setSearchResults(undefined);
    setTmdbId("");
    setPreviewData(undefined);
    setError("");
  };

  const search = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (state !== "loading") setState("loading");

    fetch("/api/migrate-movie/search", {
      method: "POST",
      body: JSON.stringify({
        query,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setState("results");
          setSearchResults(res.data);
        } else {
          setState("initial");
          setError(res.message);
        }
      })
      .catch(() => {
        setState("initial");
        setError(t("Server could not be reached") as string);
      });
  };

  const preview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (state !== "loading") setState("loading");

    const tmdbId = "tmdbId" in e.target && (e.target.tmdbId as any).value;
    setTmdbId(tmdbId);

    fetch("/api/migrate-movie/preview", {
      method: "POST",
      body: JSON.stringify({
        tmdbId,
        locale,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setState("preview");
          setPreviewData(res.data);
        } else {
          setState("initial");
          setError(res.message);
        }
      })
      .catch(() => {
        setState("initial");
        setError(t("Server could not be reached") as string);
      });
  };

  const onImageChoiceChange =
    (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = images;
      value[type as keyof typeof images] = e.target.value;
      setImages(value);
    };

  const migrate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (state !== "loading") setState("loading");

    fetch("/api/migrate-movie/migrate", {
      method: "POST",
      body: JSON.stringify({
        tmdbId,
        images,
        locale,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setMigratedMovie(res.data.movie);
          setWarnings(res.data.warnings);
          setState("success");
        } else {
          setState("initial");
          setError(res.message);
        }
      })
      .catch(() => {
        setState("initial");
        setError(t("Server could not be reached") as string);
      });
  };

  // auto focus success or loading message
  useEffect(() => {
    loading.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    success.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  return (
    <div className="container">
      {state === "loading" && <div ref={loading}>{t("Loading...")}</div>}
      {state === "success" && migratedMovie && (
        <div ref={success}>
          <p
            dangerouslySetInnerHTML={{
              __html: t("Successfully created movie {{link}}", {
                link: `<a href="/admin/collections/movies/${migratedMovie.id}">${migratedMovie.title}</a>`,
              }) as string,
            }}
          />
          {warnings.length > 0 && (
            <ul className="error">
              {warnings.map((message: string, i) => (
                <li key={i}>{message}</li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() =>
              window.open(
                `/admin/collections/movies/${migratedMovie.id}`,
                "_self"
              )
            }
          >
            {t("Review & publish")}
          </button>
        </div>
      )}
      {(state === "initial" ||
        (state === "results" && !searchResults?.results.length)) && (
        <form onSubmit={search} className="initial">
          <label
            htmlFor="query"
            dangerouslySetInnerHTML={{
              __html: t("AdminExplainTmdbId") as string,
            }}
          />
          <div className="horizontal">
            <input
              type="text"
              name="query"
              required={true}
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              placeholder={t("Search for a movie") as string}
            />
            <input type="submit" value={t("Proceed") as string} />
          </div>
          {error && (
            <div
              className="error"
              dangerouslySetInnerHTML={{ __html: error }}
            />
          )}
        </form>
      )}
      {state === "results" && (
        <form onSubmit={preview}>
          {searchResults?.results.length ? (
            <>
              <ul className="results">
                {searchResults.results.map((result: any) => (
                  <li key={result.id}>
                    <label>
                      <input
                        type="radio"
                        name="tmdbId"
                        value={result.id}
                        required={true}
                      />
                      <div className="movie">
                        <img
                          alt=""
                          src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                        />
                        <div className="info">
                          <h3>{result.original_title}</h3>
                          <span>{result.release_date.split("-")[0]}</span>
                          <p>{result.overview}</p>
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
              <button type="submit" value="search">
                {t("Proceed")}
              </button>
            </>
          ) : (
            <p className="error">{t("No results found")}</p>
          )}
        </form>
      )}
      {state === "preview" && previewData && (
        <form onSubmit={migrate} className="preview">
          <div className="title">{previewData.movie.original_title}</div>
          {["backdrop", "poster"].map((type: string) => (
            <div key={type} className="imageSelector" data-type={type}>
              <label htmlFor={type}>
                {t("Choose a {{type}}:", {
                  type: t(type),
                })}
              </label>
              <div className="choices" onChange={onImageChoiceChange(type)}>
                {previewData.images[
                  `${type}s` as keyof tmdbPreviewResult["images"]
                ]
                  .slice(0, 5)
                  .map((image: any) => (
                    <label key={image.file_path} className="choice">
                      <input
                        type="radio"
                        name={type}
                        value={image.file_path}
                        required={true}
                      />
                      <img
                        alt=""
                        src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                      />
                    </label>
                  ))}
              </div>
            </div>
          ))}
          <button type="submit" value="migrate">
            {t("Confirm")}
          </button>
          <button type="button" data-button-type="cancel" onClick={cancel}>
            {t("Cancel")}
          </button>
        </form>
      )}
      <button
        type="button"
        data-button-type="cancel"
        onClick={cancel}
        className="reset"
      >
        {t("Reset")}
      </button>
    </div>
  );
};

export default MigrateMovie;
