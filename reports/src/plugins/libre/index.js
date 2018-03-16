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
    this.proposalStruct = {
      'type': 0,
      'recipient': 1,
      'amount': 2,
      'buffer': 3,
      'bytecode': 4,
      'description': 5
    }

    this.consts = {
      DECIMALS: 18,
      MIN_READY_ORACLES: 2,
      MIN_ORACLES_ENABLED: 2,
      REVERSE_PERCENT: 100,
      RATE_MULTIPLIER: 1000
    }

    this.typeProposals = [
      {text: 'Finished', key: 'CLEAN'},
      {
        text: 'Custom', 
        key: 'UNIVERSAL', 
        benef: 'Beneficiary:', 
        amount: 'Amount Wei:',
        code: 'Bytecode:'
      },
      {
        text: 'Transfer Ownership', 
        key: 'TRANSFER_OWNERSHIP', 
        benef: 'New Owner:'
      },
      {
        text: 'New token', 
        key: 'ATTACH_TOKEN', 
        benef: 'Token Address:'
      },
      {
        text: 'New Bank', 
        key: 'SET_BANK_ADDRESS', 
        benef: 'Bank Address:'
      },
      {
        text: 'Changer fees', 
        key: 'SET_FEES', 
        amount: 'Buy fee:', 
        buf: 'Sell fee:'
      },
      {
        text: 'Add Oracle', 
        key: 'ADD_ORACLE', 
        benef: 'Oracle Address:'
      },
      {
        text: 'Disable Oracle', 
        key: 'DISABLE_ORACLE', 
        benef: 'Oracle Address:'
      },
      {
        text: 'Enable Oracle', 
        key: 'ENABLE_ORACLE', 
        benef: 'Oracle Address:'
      },
      {
        text: 'Delete Oracle', 
        key: 'DELETE_ORACLE', 
        benef: 'Oracle Address:'
      },
      {
        text: 'Set schedule', 
        key: 'SET_SCHEDULER', 
        benef: 'Scheduler Address:'
      },
      {
        text: 'Withdraw balance', 
        key: 'WITHDRAW_BALANCE'
      },
      {
        text: 'New oracle timeout',
        key: 'SET_ORACLE_TIMEOUT',
        amount: 'Period:'
      },
      {
        text: 'Oracle actual time',
        key: 'SET_ORACLE_ACTUAL',
        amount: 'Period:'
      },
      {
        text: 'New rate period',
        key: 'SET_RATE_PERIOD',
        amount: 'Period:'
      },
      {
        text: 'Set lock',
        key: 'SET_LOCK',
        lock: 'Lock:'
      },
      {
        text: 'Claim ownership',
        key: 'CLAIM_OWNERSHIP'
      }
    ]
  }
}

Vue.use(Libre, {})
