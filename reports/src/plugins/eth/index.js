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
    this.loadWeb3()
  }

  loadWeb3 () {
    try {
      if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(window.web3.currentProvider)
        web3.version.getNetwork((error, result) => {
          if (error) alert(error)
          else {
            let network = {'1':'Main','2':'Modern','3':'Ropsten','4':'Rinkeby','42':'Kovan'}[result]
            if (network != 'Rinkeby')
              alert('Please use Rinkeby nerwork!!')
          }
        })
      } else {
        window.web3 = new Web3(new Web3.providers.HttpProvider(Config.provider))
        console.log('No web3? You should consider trying MetaMask!')
      }
      this._web3 = window.web3
      this._web3.eth.defaultAccount = this._web3.eth.accounts[0]
      this._reportContract = this._web3.eth.contract(JSON.parse(Config.report.abi))
      .at(ETH.reportAddress())

      this._bankContract = this._web3.eth.contract(JSON.parse(Config.bank.abi))
      .at(Config.bank.address)

      // wrapper for MetaMask
      this.bankContract = new Proxy(this._bankContract,{get: async (bank,name) => {
        return new Promise((resolve, reject) => {
          bank[name]((err, result) => {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }})

      // token contract from Exchanger
      this.bankContract.tokenAddress.then(address => {
        Config.token.address = address
        this._tokenContract = this._web3.eth.contract(JSON.parse(Config.token.abi))
        .at(Config.token.address)

        // token wrapper for MetaMask
        this.tokenContract = new Proxy(this._tokenContract,{get: async (token,name) => {
          return new Promise((resolve, reject) => {
            token[name]((err, result) => {
              if (err) reject(err)
              else resolve(result)
            })
          })
        }})
      })

    } catch (err) {
      console.log(err)
    }
  }

  static reportAddress () {
    return Config.report.address
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
