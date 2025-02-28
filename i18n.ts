import { getRequestConfig } from 'next-intl/server';

import routing from './i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `locale` parameter is valid

  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'en' | 'pl')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./intl_messages/${locale}.json`)).default,
  };
});
