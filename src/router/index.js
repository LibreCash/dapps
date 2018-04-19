import Vue from 'vue'
import Router from 'vue-router'
import Report from '@/pages/Report'
import FundStatus from '@/pages/FundStatus'
import DAO from '@/pages/DAO'
import Loans from '@/pages/Loans'
import Loan from '@/pages/Loan'
import Proposal from '@/pages/Proposal'
import NewProposal from '@/pages/NewProposal'
import NewOffer from '@/pages/NewOffer'
import ContractStatus from '@/pages/ContractStatus'
import Deposit from '@/pages/Deposit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Report',
      component: Report
    },
    {
      path: '/',
      alias: '/status',
      name: 'Emission Contract Status',
      component: ContractStatus
    },
    {
      path: '/fund',
      name: 'Fund Status',
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
      name: 'DAO Proposal Info',
      component: Proposal
    },
    {
      path: '/dao/loan/:type/:id',
      name: 'Loan Offer',
      component: Loan
    },
    {
      path: '/dao/new_offer',
      name: 'New offer',
      component: NewOffer
    },
    {
      path: '/dao/new_proposal',
      name: 'New proposal',
      component: NewProposal
    },
    {
      path: '/deposit',
      name: 'Deposit',
      component: Deposit
    }
  ],
  mode: 'hash'
})
