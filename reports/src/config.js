module.exports = {
  report: {
    address: '0x6AF43411Ee83354C53FC6ff1c8987790fa84AE4d',
    abi: '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reports","outputs":[{"name":"textReport","type":"string"},{"name":"date","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"counter","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newReport","type":"string"}],"name":"addNewReport","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'
  },
  bank: {
    address: '0x1321b80294e16740f301ccc01fb009df2a98f000',
    abi: '[{"constant":false,"inputs":[],"name":"refillBalance","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"requestPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"requestRates","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sellFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"calcTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"readyOracles","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"waitingOracles","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"number","type":"uint256"}],"name":"getOracleData","outputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"},{"name":"","type":"bytes16"},{"name":"","type":"bool"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"oracles","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oracleCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sellRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"withdrawWallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"calcRates","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"tokensCount","type":"uint256"}],"name":"sellTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"requestTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"buyRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_token","type":"address"},{"name":"_buyFee","type":"uint256"},{"name":"_sellFee","type":"uint256"},{"name":"_oracles","type":"address[]"},{"name":"_deadline","type":"uint256"},{"name":"_withdrawWallet","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"rate","type":"uint256"},{"indexed":false,"name":"oracle","type":"address"}],"name":"InvalidRate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oracle","type":"address"}],"name":"OracleRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"tokenAmount","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"Buy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"cryptoAmount","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"Sell","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"ReserveRefill","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"ReserveWithdraw","type":"event"}]',
    status: [
      {
        name: 'LibreCash',
        getter: 'tokenAddress',
        process: data => data
      },
      {
        name: 'Buy Rate',
        getter: 'buyRate',
        process: data => `${data / 1000} LIBRE/ETH`
      },
      {
        name: 'Sell Rate',
        getter: 'sellRate',
        process: data => `${data / 1000} LIBRE/ETH`
      },
      {
        name: 'Buy Fee',
        getter: 'buyFee',
        process: data => `${data / 100} %`
      },
      {
        name: 'Sell Fee',
        getter: 'sellFee',
        process: data => `${data / 100} %`
      },
      {
        name: 'Oracle Count',
        getter: 'oracleCount',
        process: data => +data
      },
      {
        name: 'Request price',
        getter: 'requestPrice',
        process: data => `${data / 10 ** 18} ETH`
      },
      {
        name: 'State',
        getter: 'getState',
        process: data => [
            'Locked',
            'Processing Orders',
            'Wait Oracles',
            'Calculate Rates',
            'Request Rates'
          ][data]
      },
      {
        name: 'Request time',
        getter: 'requestTime',
        process: data => (+data > 0) ? (new Date(data * 1000)).toLocaleString() : '-'
      },
      {
        name: 'Calc time',
        getter: 'calcTime',
        process: data => (+data > 0) ? (new Date(data * 1000)).toLocaleString() : '-'
      },
      {
        name: 'Exchanger tokens',
        getter: 'tokenBalance',
        process: data => `${data / 10 ** 18} LIBRE`
      }
    ]
  },
  balance: {
    coins: [
      {
        name: 'BTC',
        address: '1H6ZZpRmMnrw8ytepV3BYwMjYYnEkWDqVP',
        request: address => `https://blockchain.info/ru/balance?active=${address}`,
        process: data => data[Object.keys(data)[0]].final_balance / 10 ** 8,
        href: address => `https://blockchain.info/address/${address}`
      },
      {
        name: 'ETH',
        address: '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
        request: address => `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=NYWQ3JWMICSEVBIPHXWJNW6WQBNQEEZ94P`,
        process: data => data.result / 10 ** 18,
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
        request: address => `https://api.blockcypher.com/v1/ltc/main/addrs/${address}?limit=1`,
        process: data => data.final_balance / 10 ** 8,
        href: address => `https://live.blockcypher.com/ltc/address/${address}`
      },
      {
        name: 'ZEC',
        address: 't1hASvMj8e6TXWryuB3L5TKXJB7XfNioZP3',
        request: address => `https://api.zcha.in/v2/mainnet/accounts/${address}`,
        process: data => data.balance,
        href: address => `https://explorer.zcha.in/accounts/${address}`
      },
      {
        name: 'ZEN',
        address: 'znaULW3nSEiuiMVa2P9WKXH6mxp4GpVvmpS',
        request: address => `http://explorer.zenmine.pro/insight-api-zen/addr/${address}/?noTxList=1`,
        process: data => data.balance,
        href: address => `http://explorer.zenmine.pro/insight/address/${address}`
      }
    ],
    coinmarketcap: {
      request: limit => `https://api3.coinmarketcap.com/v1/ticker/?limit=${+limit}`
    }
  },
  provider: 'https://rinkeby.infura.io'
}