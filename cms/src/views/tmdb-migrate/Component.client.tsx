'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { Movie } from '@/payload-types'
import { Button, useLocale } from '@payloadcms/ui'
import { tmdbImages, tmdbMovie } from './api/types'

export const MigrateMovieComponent: React.FC = () => {
  const locale = useLocale()
  const [state, setState] = useState<
    | 'initial' // show search input
    | 'loading' // show loading
    | 'chooseMovie' // show results of tmdb find
    | 'chooseBackdrop' // show backdrops of movie
    | 'choosePoster' // show posters of movie
    | 'success' // show success message
  >('initial')
  const [error, setError] = useState<string>('')
  const [warnings, setWarnings] = useState<[]>([])
  const [query, setQuery] = useState<string>('')
  const [tmdbId, setTmdbId] = useState<string | null>(null)
  const backdrop = useRef<string | null>(null)
  const poster = useRef<string | null>(null)
  const [searchResults, setSearchResults] = useState<tmdbMovie[]>()
  const [previewData, setPreviewData] = useState<{
    movie: tmdbMovie
    images: tmdbImages
  }>()
  const [migratedMovie, setMigratedMovie] = useState<Movie>()
  const success = useRef<HTMLDivElement>(null)
  const loading = useRef<HTMLDivElement>(null)

  const cancel = () => {
    setState('initial')
    setSearchResults(undefined)
    setTmdbId(null)
    setPreviewData(undefined)
    setError('')
  }

  const search = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (state !== 'loading') setState('loading')

    fetch(`/api/tmdb-migrate/search/${query}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setState('chooseMovie')
          setSearchResults(res.data)
        } else {
          setState('initial')
          setError(res.message)
        }
      })
      .catch(() => {
        setState('initial')
        setError('Netzwerkfehler')
      })
  }

  const onSelectMovie = async (tmdbId: string) => {
    setError('')
    setTmdbId(tmdbId)

    if (state !== 'loading') setState('loading')

    fetch(`/api/tmdb-migrate/preview/${tmdbId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setPreviewData(res.data)
          if (res.data.images.backdrops.length) {
            setState('chooseBackdrop')
          } else if (res.data.images.posters.length) {
            setState('choosePoster')
          } else {
            migrate()
          }
        } else {
          setState('initial')
          setError(res.message)
        }
      })
      .catch(() => {
        setState('initial')
        setError('Netzwerkfehler')
      })
  }

  const onSelectBackdrop = (filePath: string) => {
    backdrop.current = filePath
    if (previewData?.images.posters.length) {
      setState('choosePoster')
    } else {
      migrate()
    }
  }

  const onSelectPoster = (filePath: string) => {
    poster.current = filePath
    migrate()
  }

  const migrate = async () => {
    setError('')
    setState('loading')

    fetch('/api/tmdb-migrate/migrate', {
      method: 'POST',
      body: JSON.stringify({
        tmdbId,
        images: {
          backdrop: backdrop.current,
          poster: poster.current,
        },
        locale,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setMigratedMovie(res.data.movie)
          setWarnings(res.data.warnings)
          setState('success')
        } else {
          setState('initial')
          setError(res.message)
        }
      })
      .catch(() => {
        setState('initial')
        setError('Netzwerkfehler')
      })
  }

  // auto focus success or loading message
  useEffect(() => {
    loading.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    success.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
  return (
    <div className="my-8">
      {state === 'loading' && (
        <div ref={loading} className="text-gray-600">
          Lade...
        </div>
      )}
      {state === 'success' && migratedMovie && (
        <div ref={success}>
          <p>{`${migratedMovie.internationalTitle} wurde erfolgreich angelegt.`}</p>
          {warnings.length > 0 && (
            <ul className="text-red-500">
              {warnings.map((message: string, i) => (
                <li key={i}>{message}</li>
              ))}
            </ul>
          )}
          <Button
            onClick={() => window.open(`/admin/collections/movies/${migratedMovie.id}`, '_self')}
          >
            {'Überprüfen & Veröffentlichen'}
          </Button>
        </div>
      )}
      {(state === 'initial' || state === 'chooseMovie') && (
        <form onSubmit={search} className="mb-8 space-y-8">
          <p className="max-w-prose">
            Mit diesem Tool können Filmdaten von{' '}
            <a href="https://www.themoviedb.org/" target="_blank">
              The Movie Database
            </a>{' '}
            in das System migriert werden um dann für eine Filmkopie bzw. Vorstellung verwendet
            werden zu können.
          </p>
          <div className="w-lg flex shadow-md">
            <input
              type="text"
              name="query"
              required={true}
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              placeholder={'Suchbegriff'}
              className="border-1 flex-1 border-solid border-gray-300 px-4 py-2 font-sans text-lg"
            />
            <input
              type="submit"
              value={'Weiter'}
              className="border-1 flex cursor-pointer items-center border-solid border-gray-300 p-2 font-sans text-lg outline-none"
            />
          </div>
          {error && <div className="text-red-500" dangerouslySetInnerHTML={{ __html: error }} />}
        </form>
      )}
      {state === 'chooseMovie' && (
        <>
          {!searchResults?.length && <p className="text-red-500">{'Kein Treffer'}</p>}
          <div className="space-y-4">
            {searchResults?.map((result: any, index: number) => (
              <label
                key={index}
                className="flex min-h-[10em] cursor-pointer rounded-lg bg-neutral-50 p-4 hover:bg-neutral-100"
                onClick={() => onSelectMovie(result.id)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                  className="h-auto w-[8em] shrink-0 object-contain object-top"
                />
                <div className="ml-4 space-y-2">
                  <h3 className="">{result.original_title}</h3>
                  <p className="mb-2 text-gray-600">{result.release_date?.split('-')[0]}</p>
                  <p className="leading-tight">{result.overview}</p>
                </div>
              </label>
            ))}
          </div>
        </>
      )}
      {state === 'chooseBackdrop' && (
        <>
          <h3>Wähle ein Filmstill:</h3>
          <div className="my-4 flex flex-wrap items-center gap-4">
            {previewData?.images.backdrops.map((image: any) => (
              <img
                key={image.file_path}
                src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                alt=""
                onClick={() => onSelectBackdrop(image.file_path)}
                className="max-w-[40rem] cursor-pointer"
              />
            ))}
          </div>
        </>
      )}
      {state === 'choosePoster' && (
        <>
          <h3>Wähle ein Poster:</h3>
          <div className="my-4 flex flex-wrap items-center gap-4">
            {previewData?.images.posters.map((image: any) => (
              <img
                key={image.file_path}
                src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                alt=""
                onClick={() => onSelectPoster(image.file_path)}
                className="max-w-[20rem] cursor-pointer"
              />
            ))}
          </div>
        </>
      )}
      <Button onClick={cancel} className="text-neutral-500" buttonStyle="none">
        Zurücksetzen
      </Button>
    </div>
  )
}
