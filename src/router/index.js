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
      icon: 'fas fa-chart-pie',
      enabled: true
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
      icon: 'fas fa-university',
      enabled: true
    },
    {
      path: '/status',
      name: 'Contract Status',
      meta: {title: 'Contract Status - LibreBank'},
      component: ContractStatus,
      icon: 'fas fa-file-alt',
      enabled: true
    },
    {
      path: '/dao',
      alias: '/',
      name: 'DAO',
      component: DAO,
      meta: {title: 'DAO - LibreBank'},
      icon: 'fas fa-users',
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
      icon: 'fas fa-hand-holding-usd',
      enabled: true
    },
    {
      path: '/deposit',
      name: 'Deposit',
      component: Deposit,
      meta: {title: 'Deposit - Librebank'},
      icon: 'fas fa-piggy-bank',
      enabled: true
    },
    {
      path: '/loans',
      name: 'Loans',
      component: Loans,
      meta: {title: 'Loans - Librebank'},
      icon: 'fas fa-credit-card',
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
    }
  ],
  mode: 'hash'
})
