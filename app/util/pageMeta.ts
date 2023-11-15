export const pageTitle = (siteTitle: string, title?: string): string => {
  if (!title) {
    return siteTitle;
  }

  return `${title} | ${siteTitle}`;
};

export const pageDescription = (
  siteDescription: string,
  description?: string
): string => {
  return description || siteDescription;
};

export const pageKeywords = (
  siteKeywords: string,
  keywords?: string
): string => {
  return `${keywords}, ${siteKeywords}`;
};
