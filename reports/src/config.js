module.exports = {
  report: {
    address: '0x6AF43411Ee83354C53FC6ff1c8987790fa84AE4d',
    abi: '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reports","outputs":[{"name":"textReport","type":"string"},{"name":"date","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"counter","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newReport","type":"string"}],"name":"addNewReport","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'
  },
  bank: {
    address: '0x1321b80294e16740f301ccc01fb009df2a98f000',
    abi: '[{"constant":true,"inputs":[],"name":"requestPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sellFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"calcTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"readyOracles","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"waitingOracles","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"number","type":"uint256"}],"name":"getOracleData","outputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"},{"name":"","type":"bytes16"},{"name":"","type":"bool"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"oracles","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oracleCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sellRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"withdrawWallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"requestTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]',
    status: [
      {
        type: 'input',
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
  token: {
    abi: '[{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]'
  },
  dao: {
    address: '0x5922f3870C63f69FC98A26Ad759D48E7122f1535',
    abi: '[ { "constant": true, "inputs": [], "name": "sharesTokenAddress", "outputs": [ { "name": "", "type": "address", "value": "0x861cc6e3824c3e816541209355db5b12fc33c831" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "numProposals", "outputs": [ { "name": "", "type": "uint256", "value": "1" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "minDebatingPeriodInMinutes", "outputs": [ { "name": "", "type": "uint256", "value": "1" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "bank", "outputs": [ { "name": "", "type": "address", "value": "0x54bd8f120cba95b681c5345b90a19b588d153546" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "minimumQuorum", "outputs": [ { "name": "", "type": "uint256", "value": "1" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x0124ceea90258dc124b698f3c88fee8eec0c3d10" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "cash", "outputs": [ { "name": "", "type": "address", "value": "0x9b92316b73f829e75112c7152e00c34aac966aff" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "sharesAddress", "type": "address" }, { "name": "bank", "type": "address" }, { "name": "cash", "type": "address" }, { "name": "minimumSharesToPassAVote", "type": "uint256" }, { "name": "minMinutesForDebate", "type": "uint256" } ], "payable": true, "stateMutability": "payable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "proposalID", "type": "uint256" }, { "indexed": false, "name": "recipient", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "description", "type": "string" }, { "indexed": false, "name": "deadLine", "type": "uint256" } ], "name": "ProposalAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "proposalID", "type": "uint256" }, { "indexed": false, "name": "position", "type": "bool" }, { "indexed": false, "name": "voter", "type": "address" } ], "name": "Voted", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "proposalID", "type": "uint256" }, { "indexed": false, "name": "result", "type": "int256" }, { "indexed": false, "name": "quorum", "type": "uint256" } ], "name": "ProposalTallied", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "proposalID", "type": "uint256" }, { "indexed": false, "name": "recipient", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "description", "type": "string" } ], "name": "ProposalBlocking", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "newMinimumQuorum", "type": "uint256" }, { "indexed": false, "name": "newDebatingPeriodInMinutes", "type": "uint256" }, { "indexed": false, "name": "newSharesTokenAddress", "type": "address" } ], "name": "ChangeOfRules", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "constant": true, "inputs": [], "name": "getTokenBalance", "outputs": [ { "name": "", "type": "uint256", "value": "1e+26" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "proposalsLength", "outputs": [ { "name": "", "type": "uint256", "value": "1" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "proposalID", "type": "uint256" } ], "name": "calcVotes", "outputs": [ { "name": "", "type": "uint256", "value": "0" }, { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "proposalID", "type": "uint256" } ], "name": "getVotingData", "outputs": [ { "name": "", "type": "uint256", "value": "0" }, { "name": "", "type": "uint256", "value": "0" }, { "name": "", "type": "bool", "value": false }, { "name": "", "type": "uint256", "value": "1519827231" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "proposalID", "type": "uint256" } ], "name": "getProposal", "outputs": [ { "name": "", "type": "uint8", "value": "11" }, { "name": "", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "", "type": "uint256", "value": "100" }, { "name": "", "type": "uint256", "value": "100" }, { "name": "", "type": "bytes", "value": "0x30" }, { "name": "", "type": "string", "value": "set fees as 100" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "proposalID", "type": "uint256" } ], "name": "blockingProposal", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "sharesAddress", "type": "address" }, { "name": "_bank", "type": "address" }, { "name": "_cash", "type": "address" }, { "name": "minimumSharesToPassAVote", "type": "uint256" }, { "name": "minMinutesForDebate", "type": "uint256" } ], "name": "changeVotingRules", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "tp", "type": "uint8" }, { "name": "beneficiary", "type": "address" }, { "name": "weiAmount", "type": "uint256" }, { "name": "_buffer", "type": "uint256" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" }, { "name": "transactionBytecode", "type": "bytes" } ], "name": "newProposal", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "proposalID", "type": "uint256" }, { "name": "supportsProposal", "type": "bool" } ], "name": "vote", "outputs": [ { "name": "voteID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "proposalID", "type": "uint256" } ], "name": "executeProposal", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "getBalance", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_orderID", "type": "uint256" } ], "name": "getBuyOrder", "outputs": [ { "name": "", "type": "address", "value": "0x" }, { "name": "", "type": "address", "value": "0x" }, { "name": "", "type": "uint256", "value": "0" }, { "name": "", "type": "uint256", "value": "0" }, { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_orderID", "type": "uint256" } ], "name": "getSellOrder", "outputs": [ { "name": "", "type": "address", "value": "0x" }, { "name": "", "type": "address", "value": "0x" }, { "name": "", "type": "uint256", "value": "0" }, { "name": "", "type": "uint256", "value": "0" }, { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "readyOracles", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "beneficiary", "type": "address" }, { "name": "weiAmount", "type": "uint256" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" }, { "name": "transactionBytecode", "type": "bytes" } ], "name": "proposalUniversal", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "beneficiary", "type": "address" }, { "name": "etherAmount", "type": "uint256" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" }, { "name": "transactionBytecode", "type": "bytes" } ], "name": "proposalUniversalInEther", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalTransferOwnership", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_minBuyInWei", "type": "uint256" }, { "name": "_maxBuyInWei", "type": "uint256" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalSetBuyLimits", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_minSellLimit", "type": "uint256" }, { "name": "_maxSellLimit", "type": "uint256" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalSetSellLimits", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_orderID", "type": "uint256" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalCancelBuyOrder", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_orderID", "type": "uint256" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalCancelSellOrder", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_tokenAddress", "type": "address" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalAttachToken", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_period", "type": "uint256" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalRelevancePeriod", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_period", "type": "uint256" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalQueuePeriod", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_buyFee", "type": "uint256" }, { "name": "_sellFee", "type": "uint256" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalFees", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_address", "type": "address" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalAddOracle", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_address", "type": "address" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalDisableOracle", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_address", "type": "address" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalEnableOracle", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_address", "type": "address" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalDeleteOracle", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_scheduler", "type": "address" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalScheduler", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalWithdrawBalance", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_bankAddress", "type": "address" }, { "name": "jobDescription", "type": "string" }, { "name": "debatingPeriodInMinutes", "type": "uint256" } ], "name": "proposalBankAddress", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]'
  },
  balance: {
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
        request: address => `https://chain.so/api/v2/get_address_balance/ltc/${address}`,
        process: data => data.data.confirmed_balance,
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
        href: address => `https://explorer.zenmine.pro/insight/address/${address}`
      }
    ],
    coinmarketcap: {
      request: limit => `https://api.coinmarketcap.com/v1/ticker/?limit=${+limit}`
    }
  },
  provider: 'https://rinkeby.infura.io'
}
