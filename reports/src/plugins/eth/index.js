/* eslint-disable no-trailing-spaces */
import Vue from 'vue'
import Web3 from 'web3'
import Config from '@/config'

class ETH {
  static install (vue, options) {
    const eth = new ETH()
    Object.defineProperty(Vue.prototype, '$eth', {
      get () { return eth }
    })
  }

  constructor () {
    this._web3 = null
    this._reportContract = null
    this._daoContract = null
    this.yourAccount = null
    this.metamask = false
    this.loadWeb3()
  }

  loadWeb3 () {
    try {
      if (typeof web3 !== 'undefined') {
        this.metamask = true;
        window.web3 = new Web3(window.web3.currentProvider)
        web3.version.getNetwork((error, result) => {
          if (error) alert(error)
          else {
            let network = {
              '1': 'Main',
              '2': 'Modern',
              '3': 'Ropsten',
              '4': 'Rinkeby',
              '42': 'Kovan'
            }[result]
            if (network !== 'Rinkeby') {
              alert('Please use Rinkeby network!!')
            }
          }
        })
      } else {
        window.web3 = new Web3(new Web3.providers.HttpProvider(Config.provider))
        console.log('No web3? You should consider trying MetaMask!')
      }
      this._web3 = window.web3
      this._web3.eth.getAccounts((err, accounts) => {
        this._web3.eth.defaultAccount = accounts[0]
        this.yourAccount = accounts[0]
        // if not logged in
        if (this.yourAccount == null) {
          this.loginTimer = setInterval(() => {
            this._web3.eth.getAccounts((err, accounts) => {
              if (accounts.length !== 0) {
                this._web3.eth.defaultAccount = accounts[0]
                this.yourAccount = accounts[0]
                clearInterval(this.loginTimer)
              }
            })
          }, 1000)
        }
      })

      this._reportContract = this._web3.eth.contract(JSON.parse(Config.report.abi))
      .at(ETH.reportAddress())

      this._bankContract = this._web3.eth.contract(JSON.parse(Config.bank.abi))
      .at(Config.bank.address)

      // wrapper for MetaMask
      this.bankContract = new Proxy(this._bankContract, { get: (bank, name) => this.promisifyContract(bank, name) })

      // token contract from Exchanger
      this.bankContract.tokenAddress().then(address => {
        Config.token.address = address
        this._tokenContract = this._web3.eth.contract(JSON.parse(Config.token.abi))
        .at(Config.token.address)

        // token wrapper for MetaMask
        this.tokenContract = new Proxy(this._tokenContract, { get: (token, name) => this.promisifyContract(token, name) })
      })

      this._daoContract = this._web3.eth.contract(JSON.parse(Config.dao.abi))
      .at(Config.dao.address)

      this.daoContract = new Proxy(this._daoContract, { get: (dao, name) => this.promisifyContract(dao, name) })

      this.promiseLibre = this.daoContract.sharesTokenAddress().then(address => {
        this._libre = this._web3.eth.contract(JSON.parse(Config.erc20.abi))
        .at(address)

        this.libre = new Proxy(this._libre, { get: (libre, name) => this.promisifyContract(libre, name)})
      })
    } catch (err) {
      console.log(err)
    }
  }

  static reportAddress () {
    return Config.report.address
  }

  static daoAddress () {
    return Config.dao.address
  }

  static loansAddress () {
    return Config.loans.address
  }

  promisifyContract (contract, name) {
    return function () {
      return new Promise((resolve, reject) => {
        contract[name](...arguments, (err, result) => {
          err ? reject(err) : resolve(result)
        })
      })
    }
  }

  async proposalCounter () {
    return new Promise((resolve, reject) => {
      this._daoContract.proposalsLength((err, counter) => {
        err ? reject(err) : resolve(counter)
      })
    })
  }

  async getLatestBlockTime () {
    return new Promise((resolve, reject) => {
      web3.eth.getBlock('latest', (error, dt) => {
        if (error) reject(error)
        resolve(dt.timestamp)
      })
    })
  }

  // WIP
  async getReceipt (txHash) {
    var that = this
    return new Promise((resolve, reject) => {
      var i = 1
      var checkInterval = setInterval(function () {
        that._web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
          if (err) {
            clearInterval(checkInterval)
            reject(err)
          } else if (receipt !== null) {
            clearInterval(checkInterval)
            resolve(receipt)
          }
        })
        i++
        if (i > 50) {
          clearInterval(checkInterval)
          reject('timeout')
        }
      }, 3000)
    })
  }

  async getProposal (number) {
    return new Promise((resolve, reject) => {
      this._daoContract.getProposal(number, (err, report) => {
        err ? reject(err) : resolve(report)
      })
    })
  }
  async getVotingData (number) {
    const voteStruct = {        
      'yea': 0,        
      'nay': 1,        
      'voted': 2,        
      'deadline': 3      
    }
    return new Promise((resolve, reject) => {
      this._daoContract.getVotingData(number, (err, report) => {
        err ? reject(err) : resolve({
          yea: report[voteStruct.yea],
          nay: report[voteStruct.nay],
          voted: report[voteStruct.voted],
          deadline: report[voteStruct.deadline]
        })
      })
    })
  }
  async reportCounter () {
    return new Promise((resolve, reject) => {
      this._reportContract.counter((err, counter) => {
        err ? reject(err) : resolve(counter)
      })
    })
  }

  async isOwner () {
    return new Promise((resolve, reject) => {
      this._reportContract.owner((err, owner) => {
        err ? reject(err) : resolve(owner === this._web3.eth.accounts[0])
      })
    })
  }

  async addNewReport (report) {
    console.log(this._reportContract, report, this._web3)
    return new Promise((resolve, reject) => {
      this._reportContract.addNewReport(report, (err, report) => {
        err ? reject(err) : resolve(report)
      })
    })
  }

  async getReport (number) {
    return new Promise((resolve, reject) => {
      this._reportContract.reports(number, (err, report) => {
        err ? reject(err) : resolve(report)
      })
    })
  }

  isLoaded () {
    return this._web3 !== null
  }

  isAddress (addr) {
    return this._web3.utils.isAddress(addr)
  }

  getErrorMsg (error) {
    const LOCK_WALLET = 'Please, unlock you wallet!',
          METAMASK_REJECT_MESSAGE = 'User denied transaction signature';

    if (!this.metamask)
      return 'Please, install MetaMask for use it!'

    if (error.message) {
      if (error.message.includes(METAMASK_REJECT_MESSAGE))
        return 'Transaction was rejected by user'
      if (error.message.includes('Unknown address'))
        return LOCK_WALLET
    } else {
      if (error.includes('invalid address'))
        return LOCK_WALLET
    }

    return 'Unknown Error!'
  }

  toTimestamp (solidityTimestamp) {
    return solidityTimestamp * 1000
  }

  async isSuccess (hash) {
    console.log(`Check transaction success: ${hash}`)
    let tx = await this.getReceipt(hash)
    console.log(`Tx success ? ${tx.status === "0x1"}`)
    return tx.status === "0x1"
  }

  getBlockNumber () {
    return new Promise((resolve, reject) => {
      this._web3.eth.getBlockNumber((err, blockNumber) => {
        err ? reject(err) : resolve(blockNumber)
      })
    })
  }

  getConfirmations (txHash) {
    return new Promise((resolve, reject) => {
      this.getBlockNumber()
      .then(blockNumber => {
        this._web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
          if (err) reject(err)
          else if (receipt !== null) resolve(blockNumber - receipt.blockNumber)
          else resolve(0)
        })
      })
    })
  }

  sum (first, second) {
    return this._web3.toBigNumber(first).add(second)
  }

  fromWei (amount) {
    return this._web3.utils.fromWei(amount)
  }
}

Vue.use(ETH, {})
