module.exports = {
  report: {
    address: '0x6AF43411Ee83354C53FC6ff1c8987790fa84AE4d',
    abi: '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reports","outputs":[{"name":"textReport","type":"string"},{"name":"date","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"counter","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newReport","type":"string"}],"name":"addNewReport","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'
  },
  bank: {
    address: '0x2e95d3a2d8c9cbeebd903f3122c5260caa23887d',
    abi: '[{"constant":false,"inputs":[{"name":"_period","type":"uint256"}],"name":"setRatePeriod","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_buyFee","type":"uint256"},{"name":"_sellFee","type":"uint256"}],"name":"setFees","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getOracleData","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"bool"},{"name":"","type":"bool"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"deleteOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"requestPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"RATE_MULTIPLIER","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"requestRates","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"reserveTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sellFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"calcTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"readyOracles","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_scheduler","type":"address"}],"name":"setScheduler","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"}],"name":"attachToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"oracleActual","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"claimOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"waitingOracles","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"countOracles","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numEnabledOracles","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MIN_READY_ORACLES","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"sellRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ratePeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReservePercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MIN_ORACLES_ENABLED","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"disableOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferTokenOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"firstOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"fund","type":"uint256"}],"name":"schedulerUpdateRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"calcRates","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oracleTimeout","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FEE_MULTIPLIER","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_period","type":"uint256"}],"name":"setOracleTimeout","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"tokensCount","type":"uint256"}],"name":"sellTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"scheduler","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"requestTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"addOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"enableOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"buyRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_period","type":"uint256"}],"name":"setOracleActual","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_token","type":"address"},{"name":"_buyFee","type":"uint256"},{"name":"_sellFee","type":"uint256"},{"name":"_oracles","type":"address[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"tokenAmount","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"Buy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"cryptoAmount","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"Sell","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"name","type":"bytes32"}],"name":"OracleAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"name","type":"bytes32"}],"name":"OracleEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"name","type":"bytes32"}],"name":"OracleDisabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"name","type":"bytes32"}],"name":"OracleDeleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"name","type":"bytes32"}],"name":"OracleRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"description","type":"string"}],"name":"OracleError","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]',
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
        name: 'Arbitrator',
        getter: 'owner',
        process: data => data
      },
      {
        type: 'input',
        name: 'Scheduler',
        getter: 'scheduler',
        process: data => data
      },
      {
        name: 'Reserve percent',
        getter: 'getReservePercent',
        process: data => `${+data} %`
      }
    ]
  },
  token: {
    abi: '[{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]'
  },
  dao: {
    address: '0x5d2a85d00cd9723aa4204ed8410a552aaa72ad81',
    abi: '[{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prAttachToken","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"proposalID","type":"uint256"}],"name":"executeProposal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prAddOracle","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_buyFee","type":"uint256"},{"name":"_sellFee","type":"uint256"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prFees","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"proposalID","type":"uint256"}],"name":"calcVotes","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sharesTokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prDisableOracle","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"proposalID","type":"uint256"}],"name":"blockingProposal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_bankAddress","type":"address"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prBankAddress","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"numProposals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"etherAmount","type":"uint256"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"},{"name":"transactionBytecode","type":"bytes"}],"name":"prUniversalInEther","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prEnableOracle","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"proposalID","type":"uint256"}],"name":"getVotingData","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bool"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_period","type":"uint256"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prOracleActual","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prWithdrawBalance","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"minDebatingPeriodInMinutes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bank","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minimumQuorum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokenBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cash","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prDeleteOracle","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"prsLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prTransferOwnership","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_period","type":"uint256"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prOracleTimeout","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"proposalID","type":"uint256"}],"name":"getProposal","outputs":[{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bytes"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"proposalID","type":"uint256"},{"name":"supportsProposal","type":"bool"}],"name":"vote","outputs":[{"name":"voteID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"weiAmount","type":"uint256"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"},{"name":"transactionBytecode","type":"bytes"}],"name":"prUniversal","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tp","type":"uint8"},{"name":"beneficiary","type":"address"},{"name":"weiAmount","type":"uint256"},{"name":"_buffer","type":"uint256"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"},{"name":"transactionBytecode","type":"bytes"}],"name":"newProposal","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"paused","type":"uint256"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prPause","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sharesAddress","type":"address"},{"name":"_bank","type":"address"},{"name":"_cash","type":"address"},{"name":"minimumSharesToPassAVote","type":"uint256"},{"name":"minMinutesForDebate","type":"uint256"}],"name":"changeVotingRules","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prClaimOwnership","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_period","type":"uint256"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prRatePeriod","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_scheduler","type":"address"},{"name":"jobDescription","type":"string"},{"name":"debatingPeriodInMinutes","type":"uint256"}],"name":"prScheduler","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"sharesAddress","type":"address"},{"name":"_bank","type":"address"},{"name":"_cash","type":"address"},{"name":"minShares","type":"uint256"},{"name":"minDebatePeriod","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"buffer","type":"uint256"},{"indexed":false,"name":"description","type":"string"},{"indexed":false,"name":"deadLine","type":"uint256"}],"name":"ProposalAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"position","type":"bool"},{"indexed":false,"name":"voter","type":"address"}],"name":"Voted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"result","type":"int256"},{"indexed":false,"name":"quorum","type":"uint256"}],"name":"ProposalTallied","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"description","type":"string"}],"name":"ProposalBlocking","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newMinimumQuorum","type":"uint256"},{"indexed":false,"name":"newDebatingPeriodInMinutes","type":"uint256"},{"indexed":false,"name":"newSharesTokenAddress","type":"address"}],"name":"ChangeOfRules","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]'
  },
  loans: {
    address: '0xc753d1b3adf5860e4036e02219009700916feef3',
    abi: '[{"constant":true,"inputs":[],"name":"Exchanger","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"marginCallPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_period","type":"uint256"},{"name":"_amount","type":"uint256"},{"name":"_margin","type":"uint256"}],"name":"giveEth","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"cancelLibre","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_period","type":"uint256"},{"name":"_amount","type":"uint256"},{"name":"_margin","type":"uint256"}],"name":"giveLibre","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"RATE_MULTIPLIER","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_libre","type":"address"}],"name":"setLibre","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getLoanEth","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256[6]"},{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_type","type":"uint8"},{"name":"_statuses","type":"uint8"}],"name":"getLoanCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"returnLibre","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"takeLoanLibre","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"pledgePercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"loanLimitEth","outputs":[{"name":"min","type":"uint256"},{"name":"max","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_feeLibre","type":"uint256"},{"name":"_feeEth","type":"uint256"}],"name":"setFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeLibre","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeEth","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERCENT_MULTIPLIER","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"claimLibre","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_percent","type":"uint256"}],"name":"setPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"Libre","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"takeLoanEth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"returnEth","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"loansCount","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"loanLimitLibre","outputs":[{"name":"min","type":"uint256"},{"name":"max","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getLoanLibre","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256[6]"},{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_pagination","type":"uint256[2]"},{"name":"_type","type":"uint8"},{"name":"_statuses","type":"uint8"}],"name":"getLoans","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"claimEth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_exchanger","type":"address"}],"name":"setExchanger","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"claimBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"cancelEth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_percent","type":"uint256"}],"name":"setMarginCallPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_libre","type":"address"},{"name":"_exchanger","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"asset","type":"uint8"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"deadline","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"margin","type":"uint256"},{"indexed":false,"name":"status","type":"uint8"}],"name":"NewLoan","type":"event"},{"anonymous":false,"inputs":[],"name":"OracleRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oracle","type":"address"}],"name":"OracleAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"rate","type":"uint256"}],"name":"Ticker","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]'
  },
  erc20: {
    abi: '[{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]'
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
