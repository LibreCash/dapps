/* eslint-disable no-trailing-spaces */
import Vue from 'vue'
import Web3 from 'web3'
import i18n from '@/locales'

export default class Libre {
  static install (vue, options) {
    const libre = new Libre()
    Object.defineProperty(Vue.prototype, '$libre', {
      get() {
        return libre
      }
    })
  }

  constructor () {
    this.loansStruct = {
      'holder': 0,
      'recipient': 1,
      'data': {
        'outer': 2,
        'timestamp': 0,
        'period': 1,
        'amount': 2,
        'margin': 3,
        'refund': 4,
        'pledge': 5
      },
      'status': 3
    }

    this.loansType = {
      'Libre': 0,
      'ETH': 1
    }

    this.loansStatus = [
      i18n.t('lang.common.statuses.active'),
      i18n.t('lang.common.statuses.used'),
      i18n.t('lang.common.statuses.completed')
    ]

    this.proposalParams = {
      minBalance: 2000 * 10 ** 18,
      quorum: 10000 * 10 ** 18,
      minTime: 6 * 60 * 60
    }

    this.consts = {
      DECIMALS: 18,
      MIN_READY_ORACLES: 2,
      MIN_ORACLES_ENABLED: 2,
      REVERSE_PERCENT: 100,
      RATE_MULTIPLIER: 1000
    }

    this.proposalStruct = {
      'type': 0,
      'recipient': 1,
      'amount': 2,
      'buffer': 3,
      'bytecode': 4,
      'description': 5,
      'status': 6
    }

    this.proposalStatus = {
      ACTIVE: 0,
      FINISHED: 1,
      BLOCKED: 2
    }

    this.voteStruct = {
      'yea': 0,
      'nay': 1,
      'voted': 2,
      'deadline': 3
    }

    this.contractNames = {
      token: 'LibreCash',
      bank: 'ComplexBank',
      exchanger: 'ComplexExchanger'
    }

    this.typeProposals = [
      {
        text: i18n.t('lang.proposal-types.custom'),
        key: 'UNIVERSAL',
        benef: i18n.t('lang.proposal-types.beneficiary'),
        amount: i18n.t('lang.proposal-types.amount-wei'),
        code: i18n.t('lang.proposal-types.bytecode')
      },
      {
        text: i18n.t('lang.proposal-types.transfer-ownership'),
        key: 'TRANSFER_OWNERSHIP',
        benef: i18n.t('lang.proposal-types.new-owner')
      },
      {
        text: i18n.t('lang.proposal-types.new-token'),
        key: 'ATTACH_TOKEN',
        benef: i18n.t('lang.proposal-types.token-address')
      },
      {
        text: i18n.t('lang.proposal-types.new-bank'),
        key: 'SET_BANK_ADDRESS',
        benef: i18n.t('lang.proposal-types.bank-address'),
        info: i18n.t('lang.proposal-types.bank-info')
      },
      {
        text: i18n.t('lang.proposal-types.change-fees'),
        key: 'SET_FEES',
        amount: i18n.t('lang.proposal-types.buy-fee'),
        buf: i18n.t('lang.proposal-types.sell-fee'),
        type: '%'
      },
      {
        text: i18n.t('lang.proposal-types.add-oracle'),
        key: 'ADD_ORACLE',
        benef: i18n.t('lang.proposal-types.oracle-address')
      },
      {
        text: i18n.t('lang.proposal-types.disable-oracle'),
        key: 'DISABLE_ORACLE',
        benef: i18n.t('lang.proposal-types.oracle-address')
      },
      {
        text: i18n.t('lang.proposal-types.enable-oracle'),
        key: 'ENABLE_ORACLE',
        benef: i18n.t('lang.proposal-types.oracle-address')
      },
      {
        text: i18n.t('lang.proposal-types.delete-oracle'),
        key: 'DELETE_ORACLE',
        benef: i18n.t('lang.proposal-types.oracle-address')
      },
      {
        text: i18n.t('lang.proposal-types.set-scheduler'),
        key: 'SET_SCHEDULER',
        benef: i18n.t('lang.proposal-types.scheduler-address')
      },
      {
        text: i18n.t('lang.proposal-types.withdraw-balance'),
        key: 'WITHDRAW_BALANCE'
      },
      {
        text: i18n.t('lang.proposal-types.new-oracle-timeout'),
        key: 'SET_ORACLE_TIMEOUT',
        amount: i18n.t('lang.proposal-types.period')
      },
      {
        text: i18n.t('lang.proposal-types.new-oracle-actual-time'),
        key: 'SET_ORACLE_ACTUAL',
        amount: i18n.t('lang.proposal-types.period')
      },
      {
        text: i18n.t('lang.proposal-types.new-rate-period'),
        key: 'SET_RATE_PERIOD',
        amount: i18n.t('lang.proposal-types.period')
      },
      {
        text: i18n.t('lang.proposal-types.set-lock'),
        key: 'SET_LOCK',
        lock: i18n.t('lang.proposal-types.lock'),
        _amount: i18n.t('lang.proposal-types.lock'),
        type: 'bool'
      },
      {
        text: i18n.t('lang.proposal-types.claim-ownership'),
        key: 'CLAIM_OWNERSHIP'
      },
      {
        text: i18n.t('lang.proposal-types.change-arbitrator'),
        key: 'CHANGE_ARBITRATOR',
        benef: i18n.t('lang.proposal-types.new-arbitrator-address')
      }
    ]

    this.proposalStatuses = [
      {
        text: i18n.t('lang.common.statuses.active'),
        number: 0
      },
      {
        text: i18n.t('lang.common.statuses.finished'),
        number: 1
      },
      {
        text: i18n.t('lang.common.statuses.blocked'),
        number: 2
      }
    ]

    this.bankState = [
      'LOCKED',
      'PROCESSING_ORDERS',
      'WAIT_ORACLES',
      'CALC_RATES',
      'REQUEST_RATES'
    ]

    this.depositPlanStruct = {
      period: 0,
      percent: 1,
      minAmount: 2,
      description: 3
    }

    this.depositData = {
      timestamp: 0,
      deadline: 1,
      amount: 2,
      margin: 3,
      plan: 4
    }

    this.proposals = []
    this.plans = []
    this.initPromise = this.init()
    this.addressToLink = Vue.config.libre.addressToLink
  }

  async init() {
    this.web3 = window.web3;
    let config = Vue.config.libre

    if (config.report) this.report = this.getContract(config.report.abi, config.report.address)
    this.bank = this.getContract(config.bank.abi, config.bank.address)
    var address = await this.bank.tokenAddress()
    config.token.address = address
    this.token = this.getContract(config.erc20.abi, config.token.address)

    if (config.dao) {
      this.dao = this.getContract(config.dao.abi, config.dao.address)
      this.libertyAddress = address = await this.dao.sharesTokenAddress()
      this.liberty = this.getContract(config.erc20.abi, this.libertyAddress)
    }

    if (config.loans) this.loans = this.getContract(config.loans.abi, config.loans.address)
    if (config.deposit) this.deposit = this.getContract(config.deposit.abi, config.deposit.address)
    if (config.faucet) this.faucet = this.getContract(config.faucet.abi, config.faucet.address)

    if (config.bounty) 
      this.bounty = {
        bank: this.getContract(config.bounty.bank.abi, config.bounty.bank.address),
        exchanger: this.getContract(config.bounty.exchanger.abi, config.bounty.exchanger.address)
      }
  }

  getContract (abi, address) {
    if (!this.decodes)
      this.decodes = {}

    this.decodes[address] = this.web3.eth.contract(abi).at(address)

    return new Proxy(this.decodes[address], {
      get: (_contract, name) => function () {
        return new Promise((resolve, reject) => {
          _contract[name](...arguments, (err, result) => {
            err ? reject(err) : resolve(result)
          })
        })
      }
    })
  }

  getLoanObject (contractArray) {
    return {
      holder: contractArray[this.loansStruct.holder],
      recipient: contractArray[this.loansStruct.recipient],
      timestamp: +contractArray[this.loansStruct.data.outer][this.loansStruct.data.timestamp],
      period: +contractArray[this.loansStruct.data.outer][this.loansStruct.data.period],
      amount: +contractArray[this.loansStruct.data.outer][this.loansStruct.data.amount],
      margin: +contractArray[this.loansStruct.data.outer][this.loansStruct.data.margin],
      refund: +contractArray[this.loansStruct.data.outer][this.loansStruct.data.refund],
      pledge: +contractArray[this.loansStruct.data.outer][this.loansStruct.data.pledge],
      status: this.loansStatus[contractArray[this.loansStruct.status]]
    }
  }

  getProposalObject (contractArray) {
    return {
      type: +contractArray[this.proposalStruct.type],
      recipient: contractArray[this.proposalStruct.recipient],
      amount: +contractArray[this.proposalStruct.amount],
      buffer: +contractArray[this.proposalStruct.buffer],
      bytecode: contractArray[this.proposalStruct.bytecode],
      description: contractArray[this.proposalStruct.description],
      status: +contractArray[this.proposalStruct.status]
    }
  }

  toToken (contractNumber, decimals = this.consts.DECIMALS) {
    return +contractNumber / 10 ** decimals
  }

  fromToken (amount, decimals = this.consts.DECIMALS) {
    return +amount * 10 ** decimals
  }

  periodToString (seconds) {
    var years = Math.floor(seconds / (60 * 60 * 24 * 365))
    seconds -= years * 60 * 60 * 24 * 365

    var months = Math.floor(seconds / (60 * 60 * 24 * 30))
    seconds -= months * 60 * 60 * 24 * 30

    var days = Math.floor(seconds / (60 * 60 * 24))
    seconds -= days * 60 * 60 * 24

    var hours = Math.floor(seconds / (60 * 60))
    seconds -= hours * 60 * 60

    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60

    if (hours < 10) { hours = '0' + hours }
    if (minutes < 10) { minutes = '0' + minutes }
    if (seconds < 10) { seconds = '0' + seconds }
    return `${years}y ${months}m ${days}d ${hours}:${minutes}:${seconds}`
  }

  getVotingObject (contractArray) {
    return {
      yea: +contractArray[this.voteStruct.yea] / 10 ** this.consts.DECIMALS,
      nay: +contractArray[this.voteStruct.nay] / 10 ** this.consts.DECIMALS,
      voted: contractArray[this.voteStruct.voted],
      deadline: +contractArray[this.voteStruct.deadline]
    }
  }

  getDepositObject (contractArray) {
    return {
      timestamp: +contractArray[this.depositData.timestamp],
      deadline: +contractArray[this.depositData.deadline],
      amount: +contractArray[this.depositData.amount],
      margin: +contractArray[this.depositData.margin],
      plan: contractArray[this.depositData.plan]
    }
  }

  async updateProposal(index) {
    let proposal = this.getProposalObject(await this.dao.getProposal(index));
    proposal.vote = this.getVotingObject(await this.dao.getVotingData(index));
    this.proposals[index] = proposal
    return this.proposals[index]
  }

  async updateProposals (callEach) {
    try {
      let length = await this.dao.prsLength()

      if (length <= this.proposals.length)
        return

      for (let i = length - 1; i >= 0; --i) {
        await this.updateProposal(i)
        if (callEach)
          callEach(i)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async loadPlans (force = false) {
    if (this.plans.length > 0 && !force)
      return

    let 
      count = +await this.deposit.plansCount()
    
    for (let i = 0; i < count; i++) {
      let
        arr = await this.deposit.plans(i),
        plan = {
          id: i,
          period: +arr[this.depositPlanStruct.period],
          percent: +arr[this.depositPlanStruct.percent],
          minAmount: +arr[this.depositPlanStruct.minAmount],
          description: arr[this.depositPlanStruct.description]
        }

      this.plans.push(plan)
    }
  }

  bytecodeToString (address, bytecode) {
    let 
      result = '',
      hashMethod,
      params

    try {
      let contract = this.decodes[address]

      if (!contract)
        return ''

      hashMethod = bytecode.substring(0, 10)
      params = bytecode.substring(10)

      let abiMethod = contract.abi.find(elem => {
        return elem.type === 'function' && contract[elem.name].getData().substring(0, 10) === hashMethod
      })

      let typeParams = abiMethod.inputs.map(param => param.type)
      let valueParams = web3.SolidityCoder.decodeParams(typeParams, params)

      result = `${abiMethod.name}(${valueParams})`
    } catch (err) {
      console.log(err)
    }

    return result
  }

  async notify (message, type = 'is-success') {
    Vue.prototype.$snackbar.open({
      message,
      type,
      indefinite: type === 'is-danger',
      queue: true
    })
  }
}
