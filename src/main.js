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

Vue.use(ETH, {})
Vue.use(Libre, {})
Vue.use(Config, {build: 'dao'})

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
