<template>
  <div class="main" id="Mainblock">
    <button class="button navbar-burger" data-target="Mainblock">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="LeftNav" id="navMenu">
      <a href="#" class="logo">
        <img src="static/img/logo.png" width="200" height="180"/>
      </a>
      <ul class="MenuLeft">
        <li>
          <a href="/">
            <div class="Rectangle"></div>
            <span>Reports</span>
          </a>
        </li>
        <li class="active">
          <a href="/status">
            <div class="Rectangle"></div>
            <span>Status</span>
          </a>
        </li>
        <li>
          <a href="#">
            <div class="Rectangle"></div>
            <span>Analytics</span>
          </a>
        </li>
      </ul>
      <ul class="conditions">
      </ul>
    </div>

    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">LibreBank Status Page</h2>
      </div>
      <br>
      <h3 class="subtitle"><center>Balances</center></h3>
      <status-coins :tableData='coinsData'></status-coins>
      <br>
      <h3 class="subtitle"><center>Exchanger status</center></h3>
      <status-bank :tableData='exchangerData'></status-bank>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
    </section>
	</div>
</template>

<script>
import StatusCoins from '@/components/StatusCoins'
import StatusBank from '@/components/StatusBank'
export default {
  data () {
    return {
      coinsData: [],
      exchangerData: [],
      isLoading: false,
      isLoadingBalance: false,
      isLoadingBank: false
    }
  },
  methods: {
    async getBalancesData () {
      this.coinsData = []
      this.isLoading = true
      this.isLoadingBalance = true

      var coins = [
        {
          name: 'BTC',
          decimal: 8,
          request: 'https://blockchain.info/ru/balance?active=1H6ZZpRmMnrw8ytepV3BYwMjYYnEkWDqVP',
          process: data => data['1H6ZZpRmMnrw8ytepV3BYwMjYYnEkWDqVP'].final_balance
        },
        {
          name: 'ETH',
          decimal: 18,
          request: 'https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=NYWQ3JWMICSEVBIPHXWJNW6WQBNQEEZ94P',
          process: data => data.result
        },
        {
          name: 'BCH',
          decimal: 8,
          request: 'https://blockdozer.com/insight-api/addr/19hZx234vNtLazfx5J2bxHsiWEmeYE8a7k/balance',
          process: data => data
        },
        {
          name: 'LTC',
          decimal: 8,
          request: 'https://api.blockcypher.com/v1/ltc/main/addrs/3CDJNfdWX8m2NwuGUV3nhXHXEeLygMXoAj?limit=1',
          process: data => data.final_balance
        },
        {
          name: 'ZEC',
          decimal: 0,
          request: 'https://api.zcha.in/v2/mainnet/accounts/t3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd',
          process: data => data.balance
        },
        {
          name: 'ZEN',
          decimal: 0,
          request: 'http://explorer.zenmine.pro/insight-api-zen/addr/znaULW3nSEiuiMVa2P9WKXH6mxp4GpVvmpS/?noTxList=1',
          process: data => data.balance
        }
      ]

      let response = await axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=0'),
          nameCoins = coins.map((coin) => coin.name),
          countFind = 0;

      for (let i = 0; i < response.data.length; i++) {
        let coin = response.data[i],
            index = nameCoins.indexOf(coin.symbol);

        if (index >= 0) {
          coins[index].price = coin.price_usd

          if (coins.length === ++countFind) {
            break
          }
        }
      }

      let resolves = await Promise.all(coins.map((coin) => axios.get(coin.request))),
          allBalances = 0;

      for (let i = 0; i < coins.length; i++) {
        let balance = coins[i].process(resolves[i].data) / 10 ** coins[i].decimal,
            balanceUSD = coins[i].price * balance;

        allBalances += balanceUSD
        this.coinsData.push({name: coins[i].name, balance: balance, balanceUSD: balanceUSD})
      }

      this.coinsData.push({name: 'Total:', balanceUSD: allBalances})
      this.isLoadingBalance = false

      if (!this.isLoadingBank)
        this.isLoading = false
    },

    async getStatusBank () {
      this.isLoadingBank = true
      this.exchangerData.push({name: 'Hello', data: 'World!'})
      var varsObject = {
        tokenAddress: {
            default: "LibreCash",
            translate: "VAR_tokenAddress"
        },
        buyRate: {
            default: "Buy Rate",
            translate: "VAR_buyRate",
            process: (data)=>`${normalizeRate(data)} LIBRE/ETH`
        },
        sellRate: {
            default: "Sell Rate",
            translate: "VAR_sellRate",
            process: (data)=>`${normalizeRate(data)} LIBRE/ETH`
        },
        buyFee: {
            default: "Buy Fee",
            translate: "VAR_buyFee",
            process: (data) =>`${data/100} %`
        },
        sellFee: {
            default: "Sell Fee",
            translate: "VAR_sellFee",
            process: (data) =>`${data/100} %`
        },
        oracleCount: {
            default: "Oracle Count",
            translate: "VAR_countOracles"
        },
        requestPrice:{
           default:"Request price",
           translate: "VAR_requestPrice", // translate later
           process: (price) => `${etherUnits.toEther(price, 'wei')} ETH`
        },
        getState: {
            default: "State",
            translate: "VAR_contractState",
            process: (state) => stateMsg[stateName(state)]
        },
        requestTime:{
            default: "Request time",
            translate: "VAR_requestTime", //append later
            process: (timestamp)=> timestamp == 0 ? '-' : toUnixtime(timestamp)
        },
        calcTime: {
            default: "Calc time",
            translate: "VAR_calcTime", //append later
            process: (timestamp)=> timestamp == 0 ? '-' : toUnixtime(timestamp)
        },
        tokenBalance: {
            default: "Exchanger tokens",
            translate: "VAR_tokenBalance",
            process: (tokens) => `${tokens / Math.pow(10, libreService.coeff.tokenDecimals)} LIBRE`
        }
      };
      this.isLoadingBank = false

      if (!this.isLoadingBalance)
        this.isLoading = false
    }
  },
  created () {
    try {
      this.getBalancesData()
      this.getStatusBank()
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    StatusCoins,
    StatusBank
  }
}
</script>