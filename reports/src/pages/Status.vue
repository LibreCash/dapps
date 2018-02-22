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
        this.coinsData.push({
          name: coins[i].name, 
          balance: balance, 
          balanceUSD: balanceUSD,
          href: coins[i].href(coins[i].address)
        })
      }

      this.coinsData.push({name: 'Total:', balanceUSD: allBalances})
      this.isLoadingBalance = false

      if (!this.isLoadingBank)
        this.isLoading = false
    },

    async getStatusBank () {
      this.isLoadingBank = true
      this.exchangerData.push({name: 'LibreExchanger', data: Config.bank.address})
      this.exchangerData.push({name: 'LibreCash', data: await this.$eth.bankContract.tokenAddress()})
      this.exchangerData.push({name: 'Buy Rate', data: await this.$eth.bankContract.buyRate()})
      this.exchangerData.push({name: 'Sell Rate', data: await this.$eth.bankContract.sellRate()})
      this.exchangerData.push({name: 'Buy Fee', data: await this.$eth.bankContract.buyFee()})
      this.exchangerData.push({name: 'Sell Fee', data: await this.$eth.bankContract.sellFee()})
      this.exchangerData.push({name: 'Oracle Count', data: await this.$eth.bankContract.oracleCount()})
      this.exchangerData.push({name: 'Request price', data: await this.$eth.bankContract.requestPrice()})
      this.exchangerData.push({name: 'State', data: await this.$eth.bankContract.getState()})
      this.exchangerData.push({name: 'Request time', data: await this.$eth.bankContract.requestTime()})
      this.exchangerData.push({name: 'Calc time', data: await this.$eth.bankContract.calcTime()})
      this.exchangerData.push({name: 'Exchanger tokens', data: await this.$eth.bankContract.tokenBalance()})

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