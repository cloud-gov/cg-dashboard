import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { reactI18nextModule } from 'react-i18next';

import { lang } from 'skin';

const skinName = process.env.SKIN_NAME;
const skinProvidesTranslations = !!process.env.SKIN_PROVIDES_TRANSLATIONS;

if (skinProvidesTranslations) {
  i18n.use(Backend);
}

const defaultLoadPath = '/locales/{{lng}}/{{ns}}.json';
const loadPath = skinProvidesTranslations
  ? `/skins/${skinName}${defaultLoadPath}`
  : defaultLoadPath;

i18n.use(reactI18nextModule).init({
  lng: lang,

  fallbackLng: false,

  load: 'currentOnly',

  ns: ['translations'],
  defaultNS: 'translations',

  nsSeparator: false,
  keySeparator: false,

  debug: process.env.NODE_ENV !== 'production',

  interpolation: {
    escapeValue: false
  },

  react: {
    wait: true
  },

  backend: {
    loadPath
  }
});
