import { defineRouting } from 'next-intl/routing';

const routing = defineRouting({
  locales: ['en', 'pl'],
  defaultLocale: 'en',
  localePrefix: {
    mode: 'always',
    prefixes: {
      en: '/en',
      pl: '/pl',
    },
  },
  pathnames: {
    '/': '/',
  },
});

export default routing;
