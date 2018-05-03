/**
 * Import Dependency
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'

/**
 * Import Language
 */
import en from './i18n/en_US'
import ru from './i18n/ru_RU'

/**
 * Config
 */
Vue.use(VueI18n);
var locales = ['en', 'ru']

/**
 * Datetime formats
 */
const dateTimeFormats = {
    'en': {
      short: {
        year: 'numeric', month: 'short', day: 'numeric'
      },
      long: {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric'
      },
      "long+": {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
      }
    },
    'ru': {
      short: {
        year: 'numeric', month: 'short', day: 'numeric'
      },
      long: {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric'
      },
      "long+": {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
      }
    }
  }

/**
 * Export
 */
export default new VueI18n({
    locales,
    locale: locales[+localStorage.getItem("locale") || 0],
    messages: {
        locales,
        en: {
            lang: en
        },
        ru: {
            lang: ru
        }
    },
    dateTimeFormats
})