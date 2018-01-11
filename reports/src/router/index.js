import Vue from 'vue'
import Router from 'vue-router'
import Report from '@/pages/Report'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Report',
      component: Report
    }
  ],
  mode: 'history'
})
