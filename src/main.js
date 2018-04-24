// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/buefy'
import ETH from './plugins/eth'
import Libre from './plugins/libre'

Vue.config.productionTip = false

Vue.use(ETH, {})
Vue.use(Libre, {})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
