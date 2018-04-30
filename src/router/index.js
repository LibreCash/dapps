import Vue from 'vue'
import Router from 'vue-router'
// DAO
import DAO from '@/pages/DAO'
import Bounty from '@/pages/Bounty'
import Proposal from '@/pages/Proposal'
import NewProposal from '@/pages/NewProposal'
// FAUCET
import Faucet from '@/pages/Faucet'
// DEPOSIT
import Deposit from '@/pages/Deposit'
// REPORT
import Report from '@/pages/Report'
import ReportPage from '@/pages/ReportPage'
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
      path: '/reports',
      name: 'Reports',
      component: Report,
      meta: {title: 'Blockchain Report - Librebank'},
      icon: 'fas fa-chart-pie'
    },
    {
      path: '/report/:id',
      name: 'Report Page',
      component: ReportPage,
      meta: {title: 'Blockchain Report - Librebank'},
      icon: 'fas fa-chart-pie',
      enabled: false
    },
    {
      path: '/fund',
      name: 'Fund Status',
      component: FundStatus,
      meta: {title: 'Fund status - Librebank'},
      icon: 'fas fa-university'
    },
    {
      path: '/status',
      name: 'Contract Status',
      component: ContractStatus,
      icon: 'fas fa-file-alt'
    },
    {
      path: '/dao',
      alias: '/',
      name: 'DAO',
      component: DAO,
      meta: {title: 'DAO - LibreBank'},
      icon: 'fas fa-users'
    },
    {
      path: '/dao/proposal/:id',
      name: 'DAO Proposal Info',
      component: Proposal,
      meta: {title: 'Proposal Info - LibreBank'}
    },
    {
      path: '/dao/new_proposal',
      name: 'New proposal',
      component: NewProposal,
      meta: {title: 'New proposal - Librebank'}
    },
    {
      path: '/bounty',
      name: 'Bounty Program',
      component: Bounty,
      meta: {title: 'Contracts Bounty - Librebank'},
      enabled: true
    },
    {
      path: '/faucet',
      name: 'Faucet',
      component: Faucet,
      meta: {title: 'LBRS Faucet - Librebank'},
      icon: 'fas fa-hand-holding-usd',
    },
    {
      path: '/deposit',
      name: 'Deposit',
      component: Deposit,
      meta: {title: 'Deposit - Librebank'},
      icon: 'fas fa-piggy-bank'
    },
    {
      path: '/loans',
      name: 'Loans',
      component: Loans,
      meta: {title: 'Loans - Librebank'},
      icon: 'fas fa-credit-card'
    },
    {
      path: '/loan/:type/:id',
      name: 'Loan Offer',
      component: Loan,
      meta: {title: 'Loan offer - Librebank'}
    },
    {
      path: '/loans/new',
      name: 'New Loan Offer',
      component: NewOffer,
      meta: {title: 'New loan offer - Librebank'}
    }
  ],
  mode: 'hash'
})
