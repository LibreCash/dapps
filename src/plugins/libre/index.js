/* eslint-disable no-trailing-spaces */
import Vue from 'vue'
import Web3 from 'web3'
import Config from '@/config'

class Libre {
  static install (vue, options) {
    const libre = new Libre()
    Object.defineProperty(Vue.prototype, '$libre', {
      get () { return libre }
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
      'active',
      'used',
      'completed'
    ]

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

    this.voteStruct = {
      'yea': 0,
      'nay': 1,
      'voted': 2,
      'deadline': 3
    }

    this.typeProposals = [
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
        text: 'New Token', 
        key: 'ATTACH_TOKEN', 
        benef: 'Token Address:'
      },
      {
        text: 'New Bank', 
        key: 'SET_BANK_ADDRESS', 
        benef: 'Bank Address:'
      },
      {
        text: 'Change Fees', 
        key: 'SET_FEES', 
        amount: 'Buy fee, %:', 
        buf: 'Sell fee, %:'
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
        text: 'Set Scheduler', 
        key: 'SET_SCHEDULER', 
        benef: 'Scheduler Address:'
      },
      {
        text: 'Withdraw Balance', 
        key: 'WITHDRAW_BALANCE'
      },
      {
        text: 'New Oracle Timeout',
        key: 'SET_ORACLE_TIMEOUT',
        amount: 'Period, minutes:'
      },
      {
        text: 'New Oracle Actual Time',
        key: 'SET_ORACLE_ACTUAL',
        amount: 'Period, minutes:'
      },
      {
        text: 'New Rate Period',
        key: 'SET_RATE_PERIOD',
        amount: 'Period, minutes:'
      },
      {
        text: 'Set Lock',
        key: 'SET_LOCK',
        lock: 'Lock:'
      },
      {
        text: 'Claim Ownership',
        key: 'CLAIM_OWNERSHIP'
      },
      {
        text: 'Change Arbitrator',
        key: 'CHANGE_ARBITRATOR',
        benef: 'New Arbitrator Address:'
      }
    ]

    this.proposalStatuses = [
      {
        text: 'ACTIVE'
      },
      {
        text: 'FINISHED'
      },
      {
        text: 'BLOCKED'
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
    };

    this.proposals = [];
    this.plans = [];
    this.initPromise = this.init();
  }

  async init() {
    this.web3 = window.web3;

    this.report = this.getContract(Config.report.abi,Config.report.address)
    this.bank = this.getContract(Config.bank.abi, Config.bank.address)
    var address = await this.bank.tokenAddress();
    Config.token.address = address;
    this.token = this.getContract(Config.erc20.abi,Config.token.address)

    this.dao = this.getContract(Config.dao.abi,Config.dao.address)
    this.libertyAddress = address = await this.dao.sharesTokenAddress();
    this.liberty = this.getContract(Config.erc20.abi, this.libertyAddress)

    this.loans = this.getContract(Config.loans.abi,Config.loans.address)
    this.deposit = this.getContract(Config.deposit.abi,Config.deposit.address)
  }

  getContract(abi, address) {
    return new Proxy(this.web3.eth.contract(abi).at(address), { 
      get: (_contract, name) => function () {
        return new Promise((resolve, reject) => {
          _contract[name](...arguments, (err, result) => {
            err ? reject(err) : resolve(result)
          })
        })
      }
    })
  }

  getLoanObject(contractArray) {
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

  getProposalObject(contractArray) {
    return {
      type: +contractArray[this.proposalStruct.type],
      recipient: contractArray[this.proposalStruct.recipient],
      amount: +contractArray[this.proposalStruct.amount],
      buffer: +contractArray[this.proposalStruct.buffer],
      bytecode: contractArray[this.proposalStruct.bytecode],
      description: contractArray[this.proposalStruct.description],
      status: contractArray[this.proposalStruct.status]
    }
  }

  toToken(contractNumber) {
    return +contractNumber / 10 ** this.consts.DECIMALS;
  }

  fromToken(amount) {
    return +amount * 10 ** this.consts.DECIMALS;
  }

  periodToString(seconds) {
    var years = Math.floor(seconds / (60 * 60 * 24 * 365));
    seconds -= years * 60 * 60 * 24 * 365;

    var months = Math.floor(seconds / (60 * 60 * 24 * 30));
    seconds -= months * 60 * 60 * 24 * 30;

    var days = Math.floor(seconds / (60 * 60 * 24));
    seconds -= days * 60 * 60 * 24;

    var hours   = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;

    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return `${years}y ${months}m ${days}d ${hours}:${minutes}:${seconds}`;
  }

  getVotingObject(contractArray) {
    return {
      yea: +contractArray[this.voteStruct.yea] / 10 ** this.consts.DECIMALS,
      nay: +contractArray[this.voteStruct.nay] / 10 ** this.consts.DECIMALS,
      voted: contractArray[this.voteStruct.voted],
      deadline: +contractArray[this.voteStruct.deadline]
    }
  }

  getDepositObject(contractArray) {
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

  async updateProposals(callEach) {
    try {
      let length = await this.dao.prsLength()

      if (length <= this.proposals.length)
        return

      for (let i = length - 1; i >= 0; --i) {
        await this.updateProposal(i);
        if (callEach)
          callEach(i)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async loadPlans() {
    if (this.plans.length > 0)
      return

    let count = +await this.deposit.plansCount();
    for(let i =0; i < count; i++) {
      let arr = await this.deposit.plans(i),
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
}

Vue.use(Libre, {})
