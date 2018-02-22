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

      var exchanger = this.$eth.bankContract,
          status = Config.bank.status;

      this.exchangerData.push({name: 'LibreExchanger', data: Config.bank.address});

      let dataBank = await Promise.all(status.map(obj => exchanger[obj.getter]))
      console.log(dataBank);

      for (let i=0; i < status.length; i++) {
        this.exchangerData.push({
          name: status[i].name,
          data: status[i].process(dataBank[i])
        })
      }

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