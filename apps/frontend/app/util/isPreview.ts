export const isPreview = (url: string): boolean => {
  const searchParams = new URL(url).searchParams
  return !!searchParams.get('preview')
}
