/* eslint-disable no-trailing-spaces */
import Vue from 'vue'
import '../eth'

class Libre {
  static install (vue, options) {
    const libre = new Libre()
    Object.defineProperty(Vue.prototype, '$libre', {
      get () { return libre }
    })
  }

  constructor () {
    this.consts = {
      DECIMALS: 18,
      MIN_READY_ORACLES: 2,
      MIN_ORACLES_ENABLED: 2,
      REVERSE_PERCENT: 100,
      RATE_MULTIPLIER: 1000,
    }

    this.typeProposals = [
      {text: 'Finished', key: 'CLEAN'},
      {text: 'Custom', key: 'UNIVERSAL', benef:'Beneficiary:',amount:'Amount Wei:',code:'Bytecode:'},
      {text: 'Transfer Ownership', key: 'TRANSFER_OWNERSHIP', benef:'New Owner:'},
      {text: 'Set Buy Limit', key:'SET_BUY_LIMITS', amount:'Min Buy In Wei:',buf:'Max Buy In Wei:'},
      {text: 'Set Sell Limit', key:'SET_SELL_LIMITS', amount:'Min Sell In Wei:',buf:'Max Sell In Wei:'},
      {text: 'Cancel Buy Order', key:'CANCEL_BUY_ORDER', amount:'Order ID:'},
      {text: 'Cancel Sell Order', key: 'CANCEL_SELL_ORDER', amount:'Order ID:'},
      {text: 'New token', key: 'ATTACH_TOKEN', benef:'Token Address:'},
      {text: 'New Bank', key:'SET_BANK_ADDRESS', benef:'Bank Address:'},
      {text: 'New Rate Period', key: 'RELEVANCE_PERIOD', amount:'Period in seconds:'},
      {text: 'New Queue Period', key: 'QUEUE_PERIOD', amount:'Period in seconds:'},
      {text: 'Changer fees', key: 'SET_FEES', amount:'Buy fee:', buf: 'Sell fee:'},
      {text: 'Add Oracle', key: 'ADD_ORACLE', benef:'Oracle Address:'},
      {text: 'Disable Oracle', key: 'DISABLE_ORACLE', benef:'Oracle Address:'},
      {text: 'Enable Oracle', key: 'ENABLE_ORACLE', benef:'Oracle Address:'},
      {text: 'Delete Oracle', key: 'DELETE_ORACLE', benef:'Oracle Address:'},
      {text: 'Set schedule', key: 'SET_SCHEDULER', benef:'Scheduler Address:'},
      {text: 'Withdraw balance', key: 'WITHDRAW_BALANCE'}
    ]
  }
}

Vue.use(Libre, {})
