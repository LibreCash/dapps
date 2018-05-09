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
      icon: 'fas fa-chart-pie'
    },
    {
      path: '/report/:id',
      name: 'Report Page',
      component: ReportPage,
      meta: {locale: 'report'},
      icon: 'fas fa-chart-pie'
    },
    {
      path: '/fund',
      name: 'Fund Status',
      component: FundStatus,
      meta: {locale: 'fundStatus'},
      icon: 'fas fa-university'
    },
    {
      path: '/status',
      name: 'Contract Status',
      component: ContractStatus,
      meta: {locale: 'contractStatus'},
      icon: 'fas fa-file-alt'
    },
    {
      path: '/dao',
      alias: '/',
      name: 'DAO',
      component: DAO,
      meta: {locale: 'dao'},
      icon: 'fas fa-users'
    },
    {
      path: '/dao/proposal/:id',
      name: 'DAO Proposal Info',
      component: Proposal,
      meta: {locale: 'proposal'}
    },
    {
      path: '/dao/new_proposal',
      name: 'New proposal',
      component: NewProposal,
      meta: {locale: 'newProposal'}
    },
    {
      path: '/bounty',
      name: 'Bounty Program',
      component: Bounty,
      meta: {locale: 'bounty'},
      icon: 'fas fa-gift'
    },
    {
      path: '/faucet',
      name: 'Faucet',
      component: Faucet,
      meta: {locale: 'faucet'},
      icon: 'fas fa-hand-holding-usd'
    },
    {
      path: '/deposit',
      name: 'Deposit',
      component: Deposit,
      meta: {locale: 'deposit'},
      icon: 'fas fa-piggy-bank'
    },
    {
      path: '/loans',
      name: 'Loans',
      component: Loans,
      meta: {locale: 'loans'},
      icon: 'fas fa-credit-card'
    },
    {
      path: '/loan/:type/:id',
      name: 'Loan Offer',
      component: Loan,
      meta: {locale: 'loan'}
    },
    {
      path: '/loans/new',
      name: 'New Loan Offer',
      component: NewOffer,
      meta: {locale: 'newLoan'}
    }
  ],
  mode: 'hash'
})
