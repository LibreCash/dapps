// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/buefy'
import ETH from './plugins/eth'
import Libre from './plugins/libre'
import i18n from './locales'
import Config from './config'

Vue.config.productionTip = false

Vue.use(Config, {build: 'dao'})
Vue.use(ETH, {})
Vue.use(Libre, {})

router.options.routes.forEach(route => {
  route.enabled = Vue.config.libre.routes.includes(route.name)
})

router.beforeEach((to, from, next) => {
  document.title = i18n.t(`lang.titles.${to.meta.locale}`)
  next()
})

new Vue({
  el: '#app',
  router,
  i18n,
  template: '<App/>',
  components: { App }
})
