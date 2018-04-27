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
      meta: {title: 'DAO - LibreBank'},
      enabled: false
    },
    {
      path: '/reports',
      name: 'Reports',
      meta: {title: 'Reports - LibreBank'},
      component: Report,
      enabled: true
    },
    {
      path: '/status',
      name: 'Contract Status',
      meta: {title: 'Contract Status - LibreBank'},
      component: ContractStatus,
      enabled: true
    },
    {
      path: '/dao',
      name: 'DAO',
      component: DAO,
      meta: {title: 'DAO - LibreBank'},
      enabled: true
    },
    {
      path: '/dao/proposal/:id',
      name: 'DAO Proposal Info',
      component: Proposal,
      meta: {title: 'Proposal Info - LibreBank'},
      enabled: false
    },
    {
      path: '/dao/new_proposal',
      name: 'New proposal',
      component: NewProposal,
      meta: {title: 'New proposal - Librebank'},
      enabled: false
    },
    {
      path: '/faucet',
      name: 'Faucet',
      component: Faucet,
      meta: {title: 'LBRS Faucet - Librebank'},
      enabled: true
    },
    {
      path: '/deposit',
      name: 'Deposit',
      component: Deposit,
      meta: {title: 'Deposit - Librebank'},
      enabled: true
    },
    {
      path: '/loans',
      name: 'Loans',
      component: Loans,
      meta: {title: 'Loans - Librebank'},
      enabled: true
    },
    {
      path: '/loan/:type/:id',
      name: 'Loan Offer',
      component: Loan,
      meta: {title: 'Loan offer - Librebank'},
      enabled: false
    },
    {
      path: '/loans/new',
      name: 'New Loan Offer',
      component: NewOffer,
      meta: {title: 'New loan offer - Librebank'},
      enabled: false
    },
    {
      path: '/fund',
      name: 'Fund Status',
      component: FundStatus,
      meta: {title: 'Fund status - Librebank'},
      enabled: true
    }
  ],
  mode: 'hash'
})
