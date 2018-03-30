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
      'description': 5
    }

    this.voteStruct = {
      'yea': 0,
      'nay': 1,
      'voted': 2,
      'deadline': 3
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
        amount: 'Period:'
      },
      {
        text: 'New Oracle Actual Time',
        key: 'SET_ORACLE_ACTUAL',
        amount: 'Period:'
      },
      {
        text: 'New Rate Period',
        key: 'SET_RATE_PERIOD',
        amount: 'Period:'
      },
      {
        text: 'Set Lock',
        key: 'SET_LOCK',
        lock: 'Lock:'
      },
      {
        text: 'Claim Ownership',
        key: 'CLAIM_OWNERSHIP'
      }
    ]

    this.proposals = [];
  }

  async init() {
    this.web3 = window.web3;

    this.report = this.getContract(JSON.parse(Config.report.abi),Config.report.address)
    this.bank = this.getContract(JSON.parse(Config.bank.abi), Config.bank.address)
    var address = await this.bank.tokenAddress();
    Config.token.address = address;
    this.token = this.getContract(JSON.parse(Config.erc20.abi),Config.token.address)

    this.dao = this.getContract(JSON.parse(Config.dao.abi),Config.dao.address)
    this.libertyAddress = address = await this.dao.sharesTokenAddress();
    this.liberty = this.getContract(JSON.parse(Config.erc20.abi), this.libertyAddress)

    this.loans = this.getContract(JSON.parse(Config.loans.abi),Config.loans.address)
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
      description: contractArray[this.proposalStruct.description]
    }
  }

  getVotingObject(contractArray) {
    return {
      yea: +contractArray[this.voteStruct.yea] / 10 ** this.consts.DECIMALS,
      nay: +contractArray[this.voteStruct.nay] / 10 ** this.consts.DECIMALS,
      voted: contractArray[this.voteStruct.voted],
      deadline: +contractArray[this.voteStruct.deadline]
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
      let length = await this.dao.proposalsLength()

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
    //console.log("proposals", this.proposals);
  }
}

Vue.use(Libre, {})
