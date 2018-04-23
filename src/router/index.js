import Vue from 'vue'
import Router from 'vue-router'
import Report from '@/pages/Report'
import FundStatus from '@/pages/FundStatus'
import ContractStatus from '@/pages/ContractStatus'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Report',
      component: Report
    },
    {
      path: '/status',
      name: 'Exchanger Contract Status',
      component: ContractStatus
    },
    {
      path: '/fund',
      name: 'Fund Status',
      component: FundStatus
    }
  ],
  mode: 'hash'
})
