/* eslint-disable no-trailing-spaces */
import Vue from 'vue'
import Web3 from 'web3'
import SolidityCoder from 'web3/lib/solidity/coder'
import Config from '@/config'

export default class ETH {
  static async install (vue, options) {
    const eth = new ETH();
    Object.defineProperty(Vue.prototype, '$eth', {
      get () { return eth }
    })
  }

  constructor () {
    this._web3 = null
    this.yourAccount = null
    this.metamask = false
    this.network = Vue.config.libre.network
    this.loadWeb3()
  }

  async loadWeb3 () {
    try {
      if (typeof web3 !== 'undefined') {
        this.metamask = true;
        window.web3 = new Web3(window.web3.currentProvider)
        web3.version.getNetwork((error, result) => {
          if (error) Vue.prototype.$snackbar.open(error)
          else {
            let network = {
              '1': 'Main',
              '2': 'Modern',
              '3': 'Ropsten',
              '4': 'Rinkeby',
              '42': 'Kovan'
            }[result],
              networkUse = this.network[0].toUpperCase() + this.network.substring(1)
          
            if (network !== networkUse) {
              Vue.prototype.$snackbar.open(`Please use ${networkUse} network`)
            }
          }
        })
      } else {
        window.web3 = new Web3(new Web3.providers.HttpProvider(Vue.config.libre.provider))
        console.log('No web3? You should consider trying MetaMask!')
      }
      web3.SolidityCoder = SolidityCoder;

      this.accountPromise = this.loadAccounts();
    } catch (err) {
      console.log(err)
    }
  }

  async loadAccounts() {
    return new Promise((resolve, reject) => {
      this._web3 = window.web3
      this._web3.eth.getAccounts((err, accounts) => {
        this._web3.eth.defaultAccount = accounts[0];
        this.yourAccount = accounts[0];

        var account = this.yourAccount;
        setInterval(function() {
          if (web3.eth.accounts[0] !== account)
            location.reload();
        }, 1000);
        resolve();
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

  isLoaded () {
    return this._web3 !== null
  }

  isAddress (addr) {
    return this._web3.utils.isAddress(addr)
  }

  getErrorMsg (error) {
    const LOCK_WALLET = 'Please, unlock you wallet.',
          METAMASK_REJECT_MESSAGE = 'User denied transaction signature.',
          METAMASK_REJECT_FIREFOX = 'cancelTransaction';

    if (!this.metamask)
      return 'Please, install MetaMask for use it.'

    if (error.message) {
      if (error.message.includes(METAMASK_REJECT_MESSAGE) || error.message.includes(METAMASK_REJECT_FIREFOX))
        return 'Transaction was rejected by user'
      if (error.message.includes('Unknown address'))
        return LOCK_WALLET
    } else {
      if (error.includes('invalid address'))
        return LOCK_WALLET
    }

    if (error.message) return error.message;
    if (error.msg) return error.msg;
    return error;
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

  getBalance (address) {
    return new Promise((resolve, reject) => {
      this._web3.eth.getBalance(address, (err, balance) => {
        err ? reject(err) : resolve(balance)
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
    return this._web3.fromWei(amount)
  }

  toWei (amount, units) {
    return this._web3.toWei(amount, units)
  }

  isZeroAddress(address) {
    return address === '0x0000000000000000000000000000000000000000'
  }
}