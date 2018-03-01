import Vue from 'vue'
import Router from 'vue-router'
import Report from '@/pages/Report'
import Status from '@/pages/Status'
import DAO from '@/pages/DAO'
import Proposal from '@/pages/Proposal'


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
      name: 'LibreBank Status',
      component: Status
    },
	  {
      path: '/dao',
      name: 'LibreBank DAO',
      component: DAO
    },
    {
      path: '/dao/proposal/:id',
      name: 'DAO Proposal',
      component: Proposal
    }
  ],
  mode: 'hash'
})
