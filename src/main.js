// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/buefy'
import ETH from './plugins/eth'
import Libre from './plugins/libre'
import Config from './config'

Vue.config.productionTip = false

Vue.use(Config, {build: 'dao'})
Vue.use(ETH, {})
Vue.use(Libre, {})

router.options.routes.forEach(route => {
  if (Vue.config.libre.routes.includes(route.name))
    route.enabled = true
  else route.enabled = false
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
