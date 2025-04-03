import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Desteklenen diller
export const locales = ['en', 'tr'];
export const defaultLocale = 'tr';

export default getRequestConfig(async ({ locale }) => {
  const selectedLocale = locale ?? defaultLocale;

  if (!locales.includes(selectedLocale)) {
    notFound();
  }

  try {
    const messages = (await import(`./locales/${locale}.json`)).default;

    return {
      locale: selectedLocale,
      messages
    };
  } catch (error) {
    console.error(`Could not load messages for locale "${locale}"`, error);
    return {
      locale: selectedLocale,
      messages: {}
    };
  }
});