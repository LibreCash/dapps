import Vue from 'vue'

export default class Config {
  static install (vue, options) {
    Vue.config.libre = new Config(require(`./${options.build ? options.build : 'config_default'}.js`))
    Vue.prototype.config = Vue.config.libre
  }

  constructor(config) {
    Object.assign(this, config)

    this.structs = {
      report:{
        timestamp: 0,
        reportText: 1
      }
    },

    // common configs
    this.balance = {
      coins: [
        {
          name: 'BTC',
          address: '1H6ZZpRmMnrw8ytepV3BYwMjYYnEkWDqVP',
          request: address => `https://blockchain.info/ru/balance?active=${address}&cors=true`,
          process: data => data[Object.keys(data)[0]].final_balance / 10 ** 8,
          href: address => `https://blockchain.info/address/${address}`
        },
        {
          name: 'ETH',
          address: '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
          request: address => `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=NYWQ3JWMICSEVBIPHXWJNW6WQBNQEEZ94P`,
          process: data => (+data.result / 10 ** 18).toFixed(7),
          href: address => `https://etherscan.io/address/${address}`
        },
        {
          name: 'BCH',
          address: '19hZx234vNtLazfx5J2bxHsiWEmeYE8a7k',
          request: address => `https://blockdozer.com/insight-api/addr/${address}/balance`,
          process: data => data / 10 ** 8,
          href: address => `https://bitinfocharts.com/bitcoin%20cash/address/${address}`
        },
        {
          name: 'LTC',
          address: '3CDJNfdWX8m2NwuGUV3nhXHXEeLygMXoAj',
          request: address => `https://chain.so/api/v2/get_address_balance/ltc/${address}`,
          process: data => (data.data.confirmed_balance > 0) ? data.data.confirmed_balance : 0,
          href: address => `https://live.blockcypher.com/ltc/address/${address}`
        },
        {
          name: 'ZEC',
          address: 't1hASvMj8e6TXWryuB3L5TKXJB7XfNioZP3',
          request: address => `https://zcash.blockexplorer.com/api/addr/${address}`,
          process: data => data.balance,
          href: address => `https://zcash.blockexplorer.com/address/${address}`
        },
        {
          name: 'ZEN',
          address: 'znaULW3nSEiuiMVa2P9WKXH6mxp4GpVvmpS',
          request: address => `https://explorer.zensystem.io/insight-api-zen/addr/${address}/?noTxList=1`,
          process: data => data.balance,
          href: address => `http://explorer.zenmine.pro/insight/address/${address}`
        }
      ],
      coinmarketcap: {
        request: limit => `https://api.coinmarketcap.com/v1/ticker/?limit=${+limit}`
      }
    }
  }
}