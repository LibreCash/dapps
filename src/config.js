module.exports = {
  faucet: {
    address: '0xE8FEf7656F332633362bAB63e0200E80E8fd4d84',
    abi: [{"constant":false,"inputs":[{"name":"tokensAmount","type":"uint256"}],"name":"setTokenAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokensToSend","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"get","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"lbrsToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tokensSent","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"LBRS","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]
  },  
  bank: {
    address: '0x9F604D4D39968e9b68565BF90050600981c24D20',
    abi: [{"constant":true,"inputs":[],"name":"RATE_MULTIPLIER","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"reserveTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sellFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"calcTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"oracleActual","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"countOracles","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numEnabledOracles","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MIN_READY_ORACLES","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sellRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ratePeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MIN_ORACLES_ENABLED","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"firstOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oracleTimeout","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FEE_MULTIPLIER","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"scheduler","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"requestTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"buyRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_token","type":"address"},{"name":"_buyFee","type":"uint256"},{"name":"_sellFee","type":"uint256"},{"name":"_oracles","type":"address[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"tokenAmount","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"Buy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"cryptoAmount","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"Sell","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"name","type":"bytes32"}],"name":"OracleAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"name","type":"bytes32"}],"name":"OracleEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"name","type":"bytes32"}],"name":"OracleDisabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"name","type":"bytes32"}],"name":"OracleDeleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"name","type":"bytes32"}],"name":"OracleRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"description","type":"string"}],"name":"OracleError","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"getState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"tokensCount","type":"uint256"}],"name":"sellTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"}],"name":"attachToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getOracleData","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"bool"},{"name":"","type":"bool"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"readyOracles","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"waitingOracles","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_period","type":"uint256"}],"name":"setOracleTimeout","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_period","type":"uint256"}],"name":"setOracleActual","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_period","type":"uint256"}],"name":"setRatePeriod","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_buyFee","type":"uint256"},{"name":"_sellFee","type":"uint256"}],"name":"setFees","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"addOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"disableOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"enableOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"deleteOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"fund","type":"uint256"}],"name":"schedulerUpdateRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_scheduler","type":"address"}],"name":"setScheduler","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"requestPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReservePercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"requestRates","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"calcRates","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferTokenOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
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
        name: 'Oracle timeout',
        getter: 'oracleTimeout',
        process: data => `${+data} sec`
      },
      {
        name: 'Oracle actual',
        getter: 'oracleActual',
        process: data => `${+data} sec`
      },
      {
        name: 'Rate period',
        getter: 'ratePeriod',
        process: data => `${+data} sec`
      },
      {
        type: 'input',
        name: 'Owner',
        getter: 'owner',
        process: data => data
      },
      {
        type: 'input',
        name: 'Scheduler',
        getter: 'scheduler',
        process: data => data
      }
    ]
  },
  token: {
    address:"",
    abi: [{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]
  },
  dao: {
    address: '0x658F994a612188A80c99d721Bb8E3Ded8FCe9B9c',
    abi: [{"constant":false,"inputs":[{"name":"proposalID","type":"uint256"}],"name":"executeProposal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"proposalID","type":"uint256"}],"name":"calcVotes","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sharesTokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"proposalID","type":"uint256"}],"name":"blockingProposal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"numProposals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"proposalID","type":"uint256"}],"name":"getVotingData","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bool"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bank","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minimumQuorum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokenBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minDebatingPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cash","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"prsLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"proposalID","type":"uint256"}],"name":"getProposal","outputs":[{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bytes"},{"name":"","type":"string"},{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"proposalID","type":"uint256"},{"name":"supportsProposal","type":"bool"}],"name":"vote","outputs":[{"name":"voteID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tp","type":"uint8"},{"name":"_beneficiary","type":"address"},{"name":"_weiAmount","type":"uint256"},{"name":"_buffer","type":"uint256"},{"name":"_jobDescription","type":"string"},{"name":"_debatingPeriod","type":"uint256"},{"name":"_transactionBytecode","type":"bytes"}],"name":"newProposal","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sharesAddress","type":"address"},{"name":"_bank","type":"address"},{"name":"_cash","type":"address"},{"name":"minimumSharesToPassAVote","type":"uint256"},{"name":"minSecondsForDebate","type":"uint256"}],"name":"changeVotingRules","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"sharesAddress","type":"address"},{"name":"_bank","type":"address"},{"name":"_cash","type":"address"},{"name":"minShares","type":"uint256"},{"name":"minDebatePeriod","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"buffer","type":"uint256"},{"indexed":false,"name":"description","type":"string"},{"indexed":false,"name":"deadLine","type":"uint256"}],"name":"ProposalAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"position","type":"bool"},{"indexed":false,"name":"voter","type":"address"}],"name":"Voted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"result","type":"int256"},{"indexed":false,"name":"quorum","type":"uint256"}],"name":"ProposalTallied","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"description","type":"string"}],"name":"ProposalBlocking","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newMinimumQuorum","type":"uint256"},{"indexed":false,"name":"newdebatingPeriod","type":"uint256"},{"indexed":false,"name":"newSharesTokenAddress","type":"address"}],"name":"ChangeOfRules","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]
  },
  erc20: {
    abi: [{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
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
