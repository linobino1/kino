'use client'

import type { MigratedMovie, tmdbImages, tmdbMovie } from '@app/themoviedb/types'
import type { Locale } from '@app/i18n'
import React, { useActionState, useEffect, useRef, useState } from 'react'
import { Button, useLocale } from '@payloadcms/ui'
import { search } from './actions/search'
import { migrate as migrateAction } from './actions/migrate'
import { getPreviewData } from './actions/preview'

export const MigrateMovieComponent: React.FC = () => {
  const locale = useLocale() as unknown as Locale
  const [state, setState] = useState<
    | 'initial' // show search input
    | 'showSearchResults' // show results of tmdb find
    | 'chooseBackdrop' // show backdrops of movie
    | 'choosePoster' // show posters of movie
    | 'success' // show success message
  >('initial')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const [warnings, setWarnings] = useState<string[]>([])
  const [query, setQuery] = useState<string>('')
  const [tmdbId, setTmdbId] = useState<number>()
  const backdrop = useRef<string>(undefined)
  const poster = useRef<string>(undefined)
  const [searchResults, setSearchResults] = useState<tmdbMovie[]>()
  const [previewData, setPreviewData] = useState<{
    movie: tmdbMovie
    images: tmdbImages
  }>()
  const [migratedMovie, setMigratedMovie] = useState<MigratedMovie>()
  const success = useRef<HTMLDivElement>(null)
  const loading = useRef<HTMLDivElement>(null)

  const cancel = () => {
    setState('initial')
    setSearchResults(undefined)
    setTmdbId(undefined)
    setPreviewData(undefined)
    setError('')
  }

  const [searchState, searchAction] = useActionState(search, undefined)

  const selectMovie = async (tmdbId: number) => {
    setTmdbId(tmdbId)
    const res = await getPreviewData(tmdbId, locale)

    if (res.success && res.data) {
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
  }

  useEffect(() => {
    if (searchState?.success) {
      setSearchResults(searchState.data)
      setState('showSearchResults')
    } else {
      setError(searchState?.message)
    }
  }, [searchState])

  const migrate = async () => {
    setError('')
    setIsLoading(true)

    if (!tmdbId) {
      throw new Error('No tmdbId')
    }

    try {
      const res = await migrateAction({
        tmdbId,
        images: {
          backdrop: backdrop.current,
          poster: poster.current,
        },
      })
      if (res.success) {
        setMigratedMovie(res.data?.movie)
        setWarnings(res.data.warnings)
        setState('success')
      } else {
        setState('initial')
        setError(res.message)
      }
    } catch {
      setState('initial')
      setError('Netzwerkfehler')
    } finally {
      setIsLoading(false)
    }
  }

  // auto focus success or loading message
  useEffect(() => {
    loading.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    success.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })

  return (
    <div className="my-8">
      {isLoading && (
        <div ref={loading} className="text-gray-600">
          Lade...
        </div>
      )}
      {(state === 'initial' || state === 'showSearchResults') && (
        <div className="mb-8 space-y-2">
          <p className="max-w-prose">
            Mit diesem Tool können Filmdaten von{' '}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
              The Movie Database
            </a>{' '}
            in das System migriert werden um dann für eine Filmkopie bzw. Vorstellung verwendet
            werden zu können.
            <br />
            <br />
            Freitextsuche in der TMDB Datenbank:
          </p>
          <form action={searchAction} className="w-lg flex shadow-md">
            <input
              type="text"
              name="query"
              required={true}
              onChange={(e) => setQuery(e.target.value)}
              value={query || 'test'}
              placeholder={'Suchbegriff'}
              className="border-1 flex-1 border-solid border-gray-300 px-4 py-2 font-sans text-lg"
            />
            <input
              type="submit"
              value={'Suche'}
              className="border-1 flex cursor-pointer items-center border-solid border-gray-300 p-2 font-sans text-lg outline-none"
            />
          </form>
          <p>Oder:</p>
          <form
            className="w-sm flex shadow-md"
            onSubmit={(e) => {
              e.preventDefault()
              const value = parseInt(
                (e.currentTarget.querySelector('input[type=number]') as HTMLInputElement).value,
              )
              selectMovie(value)
            }}
          >
            <input
              type="number"
              placeholder="TMDB ID"
              className="border-1 flex-1 border-solid border-gray-300 px-4 py-2 font-sans text-lg"
            />
            <input
              type="submit"
              value={'Weiter'}
              className="border-1 flex cursor-pointer items-center border-solid border-gray-300 p-2 font-sans text-lg outline-none"
            />
          </form>
          {error && <div className="text-red-500" dangerouslySetInnerHTML={{ __html: error }} />}
        </div>
      )}
      {state === 'showSearchResults' && (
        <>
          {!searchResults?.length && <p className="text-red-500">{'Kein Treffer'}</p>}
          <form className="space-y-4">
            {searchResults?.map((result: any, index: number) => (
              <label
                key={index}
                className="flex min-h-[10em] cursor-pointer rounded-lg bg-neutral-50 p-4 hover:bg-neutral-100"
                onClick={() => selectMovie(result.id)}
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
          </form>
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
                onClick={() => {
                  backdrop.current = image.file_path
                  if (previewData?.images.posters.length) {
                    setState('choosePoster')
                  } else {
                    migrate()
                  }
                }}
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
                onClick={() => {
                  poster.current = image.file_path
                  migrate()
                }}
                className="max-w-[20rem] cursor-pointer"
              />
            ))}
          </div>
        </>
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
      <Button onClick={cancel} className="text-neutral-500" buttonStyle="none">
        Zurücksetzen
      </Button>
    </div>
  )
}
