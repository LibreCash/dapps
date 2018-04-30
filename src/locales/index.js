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
let locales = ['en', 'ru'];

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
	}
})