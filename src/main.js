// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/buefy'
import ETH from './plugins/eth'
import Libre from './plugins/libre'
import VueI18n from 'vue-i18n'

Vue.config.productionTip = false

Vue.use(ETH, {})
Vue.use(Libre, {})
Vue.use(VueI18n)

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
      message: {
        hello: "yo"
      }
    }
  },
})

new Vue({
  el: '#app',
  router,
  i18n,
  template: '<App/>',
  components: { App }
})
