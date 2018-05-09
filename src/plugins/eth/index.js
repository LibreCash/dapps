/* eslint-disable no-trailing-spaces */
import Vue from 'vue'
import Web3 from 'web3'
import SolidityCoder from 'web3/lib/solidity/coder'
import i18n from '../../locales'

export default class ETH {
  static async install (vue, options) {
    const eth = new ETH()
    Object.defineProperty(Vue.prototype, '$eth', {
      get () { return eth }
    })
  }

  constructor () {
    this.yourAccount = null
    this.metamask = false
    this.network = Vue.config.libre.network
    this.loadWeb3()
  }

  async loadWeb3 () {
    try {
      if (typeof web3 !== 'undefined') {
        this.metamask = true
        window.web3 = new Web3(window.web3.currentProvider)
        web3.version.getNetwork((error, result) => {
          if (error) Vue.prototype.$snackbar.open({message: error, indefinite: true})
          else {
            let
              network = {
                '1': 'Main',
                '2': 'Modern',
                '3': 'Ropsten',
                '4': 'Rinkeby',
                '42': 'Kovan'
              }[result],
              networkUse = this.network[0].toUpperCase() + this.network.substring(1)
          
            if (network !== networkUse) {
              Vue.prototype.$snackbar.open({message: i18n.t('lang.messages.only-network', {network: networkUse}), indefinite: true})
            }
          }
        })
      } else {
        window.web3 = new Web3(new Web3.providers.HttpProvider(Vue.config.libre.provider))
        console.log(i18n.t('lang.common.no-web3'))
      }
      web3.SolidityCoder = SolidityCoder

      this.accountPromise = this.loadAccounts()
    } catch (err) {
      console.log(err)
    }
  }

  async loadAccounts () {
    return new Promise((resolve, reject) => {
      window.web3.eth.getAccounts((err, accounts) => {
        window.web3.eth.defaultAccount = accounts[0]
        this.yourAccount = accounts[0]

        setInterval(() => {
          if (web3.eth.accounts[0] !== this.yourAccount)
            location.reload()
        }, 1000)
        resolve()
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

  async getReceipt (txHash) {
    const txTimeout = 10 * 60 * 1000; // 10 minutes
    let beginTime = +new Date();
    return new Promise((resolve, reject) => {
      var checkInterval = setInterval(() => {
        window.web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
          if (err) {
            clearInterval(checkInterval)
            reject(err)
          } else if (receipt !== null) {
            clearInterval(checkInterval)
            resolve(receipt)
          }
        })
        if (+new Date() - beginTime > txTimeout) {
          clearInterval(checkInterval)
          reject(i18n.t('lang.common.timeout'))
        }
      }, 3000)
    })
  }

  isInteger (number) {
    return +number >= 0
  }

  isAddress (address) {
    return window.web3.isAddress(address)
  }

  getErrorMsg (error) {
    const LOCK_WALLET = i18n.t('lang.messages.pls-unlock'),
          METAMASK_REJECT_MESSAGE = 'User denied transaction signature.',
          METAMASK_REJECT_FIREFOX = 'cancelTransaction';

    if (!this.metamask) {
      return i18n.t('lang.messages.install-metamask');
    }

    if (error.message) {
      if (error.message.includes(METAMASK_REJECT_MESSAGE) || error.message.includes(METAMASK_REJECT_FIREFOX)) {
        return i18n.t('lang.messages.user-rejected');
      }
      if (error.message.includes('Unknown address')) {
        return LOCK_WALLET
      }
    } else {
      if (error.includes('invalid address')) {
        return LOCK_WALLET
      }
    }

    if (error.message) return error.message
    if (error.msg) return error.msg
    return error
  }

  toTimestamp (solidityTimestamp) {
    return solidityTimestamp * 1000
  }

  async isSuccess (hash) {
    console.log(`Checking transaction success: ${hash}`)
    let 
      status = (await this.getReceipt(hash)).status,
      isSuccess = status === '0x1'
      
    console.log(`Tx success ? ${isSuccess}`)
    return isSuccess
  }

  getBlockNumber () {
    return new Promise((resolve, reject) => {
      window.web3.eth.getBlockNumber((err, blockNumber) => {
        err ? reject(err) : resolve(blockNumber)
      })
    })
  }

  getBalance (address) {
    return new Promise((resolve, reject) => {
      window.web3.eth.getBalance(address, (err, balance) => {
        err ? reject(err) : resolve(balance)
      })
    })
  }

  fromWei (amount) {
    return window.web3.fromWei(amount)
  }

  toWei (amount, units) {
    return window.web3.toWei(amount, units)
  }

  isZeroAddress (address) {
    return address === '0x0000000000000000000000000000000000000000'
  }

  toToken (amount, decimals = 18) {
    return +amount / 10 ** decimals
  }

  fromToken(amount, decimals = 18) {
    return +amount * 10 ** decimals
  }
}
