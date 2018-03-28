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

    this.web3 = window.web3;
    this.proposals = [];

    this.report = this.getContract(JSON.parse(Config.report.abi),Config.report.address)
    this.bank = this.getContract(JSON.parse(Config.bank.abi), Config.bank.address)
    this.bank.tokenAddress().then(address => {
      Config.token.address = address;
      this.token = this.getContract(JSON.parse(Config.token.abi),Config.token.address)
    })

    this.dao = this.getContract(JSON.parse(Config.dao.abi),Config.dao.address)
    this.promiseLibre = this.dao.sharesTokenAddress().then(address => {
      this.libre = this.getContract(JSON.parse(Config.erc20.abi),address)
    })
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

  async getVotingData (number) {
    const voteStruct = {
      'yea': 0,
      'nay': 1,
      'voted': 2,
      'deadline': 3
    }
    return this.dao.getVotingData(number, (err, report) => {
      err ? reject(err) : resolve({
        yea: report[voteStruct.yea],
        nay: report[voteStruct.nay],
        voted: report[voteStruct.voted],
        deadline: report[voteStruct.deadline]
      })
    })
  }

  async updateProposals(callEach) {
    try {
      let length = await this.dao.proposalsLength()

      if (length <= this.proposals.length)
        return

      for (let i = length - 1; i >= 0; --i) {
        var 
          proposal = (this.proposals[i] == undefined) ? 
                      (await this.dao.getProposal(i)) : (this.proposals[i].proposal),
          vote = await this.dao.getVotingData(i);

        this.proposals[i] = {proposal, vote}
        if (callEach)
          callEach(i)
      }
    } catch (err) {
      console.log(err)
    }
    console.log("proposals", this.proposals);
  }
}

Vue.use(Libre, {})
