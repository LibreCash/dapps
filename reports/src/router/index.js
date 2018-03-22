import Vue from 'vue'
import Router from 'vue-router'
//import Report from '@/pages/Report'
import FundStatus from '@/pages/FundStatus'
import DAO from '@/pages/DAO'
import Loans from '@/pages/Loans'
import Proposal from '@/pages/Proposal'
import NewProposal from '@/pages/NewProposal'
import ContractStatus from '@/pages/ContractStatus'

Vue.use(Router)

export default new Router({
  routes: [
    /*{
      path: '/',
      name: 'Report',
      component: Report
    },*/
    {
      path: '/',
      alias: '/status',
      name: 'LibreBank Emission Contract',
      component: ContractStatus
    },
    {
      path: '/fund',
      name: 'LibreBank Status',
      component: FundStatus
    },
    {
      path: '/dao',
      name: 'LibreBank DAO',
      component: DAO
    },
    {
      path: '/loans',
      name: 'LibreBank Loans',
      component: Loans
    },
    {
      path: '/dao/proposal/:id',
      name: 'DAO Proposal',
      component: Proposal
    },
    {
      path: '/dao/new_proposal',
      name: 'New proposal',
      component: NewProposal
    }
  ],
  mode: 'hash'
})
