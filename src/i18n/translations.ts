import { Language, TranslationSchema, SUPPORTED_LANGUAGES, LanguageOption } from './types';
import { es } from './locales/es';
import { en } from './locales/en';
import { zh } from './locales/zh';
import { hi } from './locales/hi';
import { fr } from './locales/fr';
import { ar } from './locales/ar';
import { pt } from './locales/pt';
import { ru } from './locales/ru';
import { ja } from './locales/ja';
import { de } from './locales/de';

export * from './types';

export const translations: Record<Language, TranslationSchema> = {
  es,
  en,
  zh,
  hi,
  fr,
  ar,
  pt,
  ru,
  ja,
  de,
};

export const getLanguageMeta = (lang: Language): LanguageOption => {
  return SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
};
