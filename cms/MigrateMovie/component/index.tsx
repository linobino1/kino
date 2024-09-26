import React, { useEffect, useRef, useState } from "react";
import { useLocale } from "payload/components/utilities";
import "./index.scss";
import type { Movie } from "payload/generated-types";
import type { tmdbFindResult, tmdbPreviewResult } from "../api/types";
import { useTranslation } from "react-i18next";

export const MigrateMovie: React.FC = () => {
  const locale = useLocale();
  const { t } = useTranslation();
  const [state, setState] = useState<
    | "initial" // show search input
    | "loading" // show loading
    | "chooseMovie" // show results of tmdb find
    | "chooseBackdrop" // show backdrops of movie
    | "choosePoster" // show posters of movie
    | "success" // show success message
  >("initial");
  const [error, setError] = useState<string>("");
  const [warnings, setWarnings] = useState<[]>([]);
  const [query, setQuery] = useState<string>("");
  const [tmdbId, setTmdbId] = useState<string | null>(null);
  const backdrop = useRef<string | null>(null);
  const poster = useRef<string | null>(null);
  const [searchResults, setSearchResults] = useState<tmdbFindResult>();
  const [previewData, setPreviewData] = useState<tmdbPreviewResult>();
  const [migratedMovie, setMigratedMovie] = useState<Movie>();
  const success = useRef<HTMLDivElement>(null);
  const loading = useRef<HTMLDivElement>(null);

  const cancel = () => {
    setState("initial");
    setSearchResults(undefined);
    setTmdbId(null);
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
          setState("chooseMovie");
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

  const onSelectMovie = async (tmdbId: string) => {
    setError("");
    setTmdbId(tmdbId);

    if (state !== "loading") setState("loading");

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
          setPreviewData(res.data);
          if (res.data.images.backdrops.length) {
            setState("chooseBackdrop");
          } else if (res.data.images.posters.length) {
            setState("choosePoster");
          } else {
            migrate();
          }
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

  const onSelectBackdrop = (filePath: string) => {
    backdrop.current = filePath;
    if (previewData?.images.posters.length) {
      setState("choosePoster");
    } else {
      migrate();
    }
  };

  const onSelectPoster = (filePath: string) => {
    poster.current = filePath;
    migrate();
  };

  const migrate = async () => {
    setError("");
    setState("loading");

    fetch("/api/migrate-movie/migrate", {
      method: "POST",
      body: JSON.stringify({
        tmdbId,
        images: {
          backdrop: backdrop.current,
          poster: poster.current,
        },
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
      <pre>tmdbId: {tmdbId}</pre>
      <pre>backdrop: {backdrop.current}</pre>
      <pre>poster: {poster.current}</pre>
      {/* <pre>{JSON.stringify(previewData, null, 2)}</pre> */}
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
        (state === "chooseMovie" && !searchResults?.results.length)) && (
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
      {state === "chooseMovie" && (
        <>
          {!searchResults?.results.length && (
            <p className="error">{t("No results found")}</p>
          )}
          <div className="tmdbResults">
            {searchResults?.results.map((result: any, index: number) => (
              <label
                key={index}
                className="item"
                onClick={() => onSelectMovie(result.id)}
              >
                <img
                  alt=""
                  src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                />
                <div className="info">
                  <h3>{result.original_title}</h3>
                  <span>{result.release_date?.split("-")[0]}</span>
                  <p>{result.overview}</p>
                </div>
              </label>
            ))}
          </div>
        </>
      )}
      {state === "chooseBackdrop" && (
        <div>
          <p>{t("Choose a backdrop:")}</p>
          <div className="backdrops">
            {previewData?.images.backdrops.map((image: any) => (
              <img
                key={image.file_path}
                src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                alt=""
                onClick={() => onSelectBackdrop(image.file_path)}
              />
            ))}
          </div>
        </div>
      )}
      {state === "choosePoster" && (
        <div>
          <p>{t("Choose a poster:")}</p>
          <div className="posters">
            {previewData?.images.posters.map((image: any) => (
              <img
                key={image.file_path}
                src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                alt=""
                onClick={() => onSelectPoster(image.file_path)}
              />
            ))}
          </div>
        </div>
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
