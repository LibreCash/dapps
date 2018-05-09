// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import './plugins/buefy'
import ETH from './plugins/eth'
import Libre from './plugins/libre'
import i18n from './locales'
import Config from './config'

Vue.config.productionTip = false

Vue.use(Config, { build: 'dao' })
Vue.use(ETH, {})
Vue.use(Libre, {})
Vue.use(Vuex)

router.options.routes.forEach(route => {
  route.enabled = Vue.config.libre.routes.includes(route.name)
})

router.beforeEach((to, from, next) => {
  document.title = i18n.t(`lang.titles.${to.meta.locale}`)
  next()
})

const store = new Vuex.Store({
  state: {
    time: 0
  },
  mutations: {
    setTime (state, _time) {
      state.time = _time * 1000;
    },
    initTicker (state) {
      setInterval(() => { state.time += 1000 }, 1000)
    }
  },
  actions: {
    async startUpdating (context, updater) {
      context.state.time = +(await updater())
      context.commit('setTime', +(await updater()))
      context.commit('initTicker')
      setInterval(async () => {
        context.state.time = +(await updater())
      }, 5 * 60 * 1000)
    }
  }
})

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  components: { App }
})
