import Vue from 'vue'
import Router from 'vue-router'
import DAO from '@/pages/DAO'
import Proposal from '@/pages/Proposal'
import NewProposal from '@/pages/NewProposal'
import Faucet from '@/pages/Faucet'
import Report from '@/pages/Report'
import FundStatus from '@/pages/FundStatus'
import ContractStatus from '@/pages/ContractStatus'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DAO',
      component: DAO
    },
    {
      path: '/status',
      name: 'Exchanger Contract Status',
      component: ContractStatus
    },
    {
      path: '/dao/proposal/:id',
      name: 'DAO Proposal Info',
      component: Proposal
    },
    {
      path: '/dao',
      name: 'LibreBank DAO',
      component: DAO
    },
    {
      path: '/faucet',
      name: 'Faucet',
      component: Faucet
    },
    {
      path: '/dao/new_proposal',
      name: 'New proposal',
      component: NewProposal
    },{
      path: '/fund',
      name: 'Fund Status',
      component: FundStatus
    }
  ],
  mode: 'hash'
})
