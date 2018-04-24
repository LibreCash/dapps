import Vue from 'vue'
import Router from 'vue-router'
// DAO
import DAO from '@/pages/DAO'
import Proposal from '@/pages/Proposal'
import NewProposal from '@/pages/NewProposal'
// FAUCET
import Faucet from '@/pages/Faucet'
// DEPOSIT
import Deposit from '@/pages/Deposit'
// REPORT
import Report from '@/pages/Report'
// LOANS
import Loans from '@/pages/Loans'
import Loan from '@/pages/Loan'
import NewOffer from '@/pages/NewOffer'
// STATUSES
import FundStatus from '@/pages/FundStatus'
import ContractStatus from '@/pages/ContractStatus'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DAO',
      component: DAO,
      menu: false
    },
    {
      path: '/status',
      name: 'Contract Status',
      component: ContractStatus,
      menu: true
    },
    {
      path: '/dao',
      name: 'DAO',
      component: DAO,
      menu: true
    },
    {
      path: '/dao/proposal/:id',
      name: 'DAO Proposal Info',
      component: Proposal,
      menu: false
    },
    {
      path: '/dao/new_proposal',
      name: 'New proposal',
      component: NewProposal,
      menu: false
    },
    {
      path: '/faucet',
      name: 'Faucet',
      component: Faucet,
      menu: true
    },
    {
      path: '/deposit',
      name: 'Deposit',
      component: Deposit,
      menu: true
    },
    {
      path: '/loans',
      name: 'Loans',
      component: Loans,
      menu: true
    },
    {
      path: '/loan/:type/:id',
      name: 'Loan Offer',
      component: Loan,
      menu: false
    },
    {
      path: '/loans/new',
      name: 'New Loan Offer',
      component: NewOffer,
      menu: false
    },
    {
      path: '/fund',
      name: 'Fund Status',
      component: FundStatus,
      menu: true
    }
  ],
  mode: 'hash'
})
