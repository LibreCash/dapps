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
import Config from '@/config'
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

      var coins = Config.balance.coins

      let response = await axios.get(Config.balance.coinmarketcap.request(0)),
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

      let resolves = await Promise.all(coins.map((coin) => axios.get(coin.request(coin.address)))),
          allBalances = 0;

      for (let i = 0; i < coins.length; i++) {
        let balance = coins[i].process(resolves[i].data),
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