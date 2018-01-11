/* eslint-disable no-trailing-spaces */
import Vue from 'vue'
import Web3 from 'web3'
import reportAbi from './reportAbi'

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
    this.loadWeb3()
  }

  loadWeb3 () {
    if (typeof web3 !== 'undefined') {
      window.web3 = new Web3(window.web3.currentProvider)
      this._web3 = window.web3
      this._web3.eth.defaultAccount = this._web3.eth.accounts[0]
      this._reportContract = this._web3.eth.contract(reportAbi).at(ETH.reportAddress())
    } else {
      this.load()
      console.log('No web3? You should consider trying MetaMask!')
    }
  }

  static reportAddress () {
    return '0x507c4ff51f549e4bd3511ac5cb2187547b2456a0'
  }

  load () {
    try {
      window.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io'))
      this._web3 = window.web3
      this._reportContract = this._web3.eth.contract(reportAbi).at(ETH.reportAddress())
    } catch (err) {
      console.log(err)
    }
  }

  async reportCounter () {
    return new Promise((resolve, reject) => {
      this._reportContract.counter((err, counter) => {
        if (err) reject(err)
        else resolve(counter)
      })
    })
  }

  async isOwner () {
    return new Promise((resolve, reject) => {
      this._reportContract.owner((err, owner) => {
        if (err) reject(err)
        else resolve(owner === this._web3.eth.accounts[0])
      })
    })
  }

  async addNewReport (report) {
    console.log(this._reportContract, report, this._web3)
    return new Promise((resolve, reject) => {
      this._reportContract.addNewReport(report, (err, report) => {
        if (err) reject(err)
        else resolve(report)
      })
    })
  }

  async getReport (number) {
    return new Promise((resolve, reject) => {
      this._reportContract.reports(number, (err, report) => {
        if (err) reject(err)
        else resolve(report)
      })
    })
  }

  isLoaded () {
    return this._web3 !== null
  }

  isAddress (addr) {
    return this._web3.utils.isAddress(addr)
  }

  getBlockNumber () {
    return new Promise((resolve, reject) => {
      this._web3.eth.getBlockNumber((err, blockNumber) => {
        if (err) reject(err)
        else resolve(blockNumber)
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
