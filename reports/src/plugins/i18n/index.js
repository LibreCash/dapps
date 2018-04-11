/* eslint-disable no-trailing-spaces */
import Vue from 'vue'
//import language from './language'
import VueI18n from 'vue-i18n'
import Config from '@/config'


class I18n {
    static install (vue, options) {
        const i18n = new VueI18n({
            locale: 'en',
            messages: {"test": "TEST"}
        })
        new Vue({ i18n }).$mount('#app')

        Object.defineProperty(Vue.prototype, '$t', {
            get () { return i18n }
        })
    }

    constructor () {

    }
}

Vue.use(VueI18n)
