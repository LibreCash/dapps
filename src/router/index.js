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
      meta: {locale: 'reports'},
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
      meta: {locale: 'fundStatus'},
      icon: 'fas fa-university',
      enabled: true
    },
    {
      path: '/status',
      name: 'Contract Status',
      meta: {locale: 'contractStatus'},
      component: ContractStatus,
      icon: 'fas fa-file-alt'
    },
    {
      path: '/dao',
      alias: '/',
      name: 'DAO',
      component: DAO,
      meta: {locale: 'dao'},
      icon: 'fas fa-users',
      enabled: true
    },
    {
      path: '/dao/proposal/:id',
      name: 'DAO Proposal Info',
      component: Proposal,
      meta: {locale: 'proposal'},
      enabled: false
    },
    {
      path: '/dao/new_proposal',
      name: 'New proposal',
      component: NewProposal,
      meta: {locale: 'newProposal'},
      enabled: false
    },
    {
      path: '/bounty',
      name: 'Bounty Program',
      component: Bounty,
      meta: {locale: 'bounty'},
      icon: 'fas fa-gift',
      enabled: true
    },
    {
      path: '/faucet',
      name: 'Faucet',
      component: Faucet,
      meta: {locale: 'faucet'},
      icon: 'fas fa-hand-holding-usd',
    },
    {
      path: '/deposit',
      name: 'Deposit',
      component: Deposit,
      meta: {locale: 'deposit'},
      icon: 'fas fa-piggy-bank',
      enabled: true
    },
    {
      path: '/loans',
      name: 'Loans',
      component: Loans,
      meta: {locale: 'loans'},
      icon: 'fas fa-credit-card',
      enabled: true
    },
    {
      path: '/loan/:type/:id',
      name: 'Loan Offer',
      component: Loan,
      meta: {locale: 'loan'},
      enabled: false
    },
    {
      path: '/loans/new',
      name: 'New Loan Offer',
      component: NewOffer,
      meta: {locale: 'newLoan'},
      enabled: false
    }
  ],
  mode: 'hash'
})
