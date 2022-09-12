import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'

export const resources = {
  en: {
    en,
  },
  zh: {
    zh,
  },
  ja: {
    ja,
  },
} as const

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  })
