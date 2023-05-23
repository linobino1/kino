import React, { useEffect, useRef, useState } from "react";
import { useLocale } from 'payload/components/utilities';
import { fixedT } from '../../i18n';
import './index.scss';
import type { Movie } from "payload/generated-types";
import type { tmdbPreview } from "../../scripts/migrateMovie";

export const MigrateMovie: React.FC = () => {
  const locale = useLocale();
  const path = 'tmdbId';
  // states:
  // initial: show input for themoviedb id
  // loading: show loading
  // preview: show preview of movie with form to select backdrop and poster image
  // success: show success message and link to the created movie
  const [state, setState] = useState<string>('initial');
  const [error, setError] = useState<string>('');
  const [tmdbId, setTmdbId] = useState<string>('');
  const [images, setImages] = useState<{
    backdrop?: string;
    poster?: string;
  }>({
    backdrop: undefined,
    poster: undefined,
  });
  const [previewData, setPreviewData] = useState<tmdbPreview>();
  const [migratedMovie, setMigratedMovie] = useState<Movie>();
  const success = useRef<HTMLDivElement>(null);
  const loading = useRef<HTMLDivElement>(null);
  
  const cancel = () => {
    setState('initial');
    setTmdbId('');
    setPreviewData(undefined);
    setError('');
  };
  
  const preview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (state !== 'loading') setState('loading');
    
    fetch('/api/tmdb-migration/preview', {
      method: 'POST',
      body: JSON.stringify({
        tmdbId: tmdbId,
        locale,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        setState('preview');
        setPreviewData(res.data);
      } else {
        setState('initial')
        setError(res.message);
      }
    })
    .catch(() => {
      setState('initial')
      setError(fixedT('Server could not be reached', locale));
    })
  };
  
  const onImageChoiceChange = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = images;
    value[type as keyof typeof images] = e.target.value;
    setImages(value);
  };
  
  const migrate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (state !== 'loading') setState('loading');
    
    fetch('/api/tmdb-migration/migrate', {
      method: 'POST',
      body: JSON.stringify({
        tmdbId,
        images,
        locale,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        setMigratedMovie(res.data);
        setState('success');
      } else {
        setState('initial')
        setError(res.message);
      }
    })
    .catch(() => {
      setState('initial')
      setError(fixedT('Server could not be reached', locale));
    })
  };
  
  // auto focus success or loading message
  useEffect(() => {
    loading.current?.scrollIntoView({ behavior: 'smooth', block: "center" });
    success.current?.scrollIntoView({ behavior: 'smooth', block: "center" });
  });
  return (
    <div className="container">
      <h2>{fixedT('Migrate movie from themoviedb.org', locale)}</h2>
      { state === 'loading' && (
        <div ref={loading}>Loading...</div>
      )}
      { state === 'success' && migratedMovie && (
        <div ref={success} dangerouslySetInnerHTML={{
          __html: fixedT('Successfully created movie {title} {id}', locale, {
            title: migratedMovie.originalTitle,
            id: migratedMovie.id,
          })
        }} />)
      }
      { state === 'preview' && previewData && (
        <form onSubmit={migrate} className="preview">
          <div className="title">{previewData.original_title}</div>
          { ['backdrop', 'poster'].map((type: string) => (
            <div key={type} className="imageSelector" data-type={type}>
              <label htmlFor={type}>
                {fixedT('Choose a {type}:', locale, {
                  type: fixedT(type, locale),
                })}
              </label>
              <div className="choices" onChange={onImageChoiceChange(type)}>
                { previewData.images[`${type}s` as keyof tmdbPreview['images']].map((image: any) => (
                  <label key={image.file_path} className="choice">
                    <input
                      type="radio"
                      name={type}
                      value={image.file_path}
                      required={true}
                    />
                    <img alt="" src={`https://image.tmdb.org/t/p/w500${image.file_path}`} />
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            value="migrate"
          >{fixedT('Migrate', locale)}</button>
          <button
            type="button"
            data-button-type="cancel"
            onClick={cancel}
          >{fixedT('Cancel', locale)}</button>
        </form>
      )}
      { state === 'initial' && (
        <form onSubmit={preview} className="initial">
          <label htmlFor={path} dangerouslySetInnerHTML={{ __html: fixedT('AdminExplainTmdbId', locale)}} />
          <div className="horizontal">
            <input
              type="text"
              name={path}
              required={true}
              onChange={(e) => setTmdbId(e.target.value)}
              value={tmdbId}
              placeholder="266"
            />
            <input
              type="submit"
              value={fixedT('Preview', locale)}
            />
          </div>
          { error && (
            <div className="error" dangerouslySetInnerHTML={{ __html: error }} />
          )}
        </form>
      )}
      <button
        type="button"
        data-button-type="cancel"
        onClick={cancel}
        className="reset"
      >{fixedT('Reset', locale)}</button>
    </div>
  )
};

export default MigrateMovie;
