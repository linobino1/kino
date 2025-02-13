import { createCookie } from 'react-router';

export const i18nCookie = createCookie('i18n', {
  sameSite: 'strict',
  path: '/',
  maxAge: 86400,
})
