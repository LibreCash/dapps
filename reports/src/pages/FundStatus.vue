/* eslint-disable-one-var */
<template>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">LibreBank Status Page</h2>
      </div>
      <br>
      <div class="columns is-vcentered table-padding">
        <div class="column">
        <h3 class="subtitle has-text-centered">Assets structure</h3>
        <div id="piechart" class="column is-gapless chart-height"></div>
        </div>
        <div class="column">
          <h3 class="subtitle has-text-centered">Overall stats:</h3>
          <div>Min diff is {{ minCoin.name }} ({{ minCoin.change24h.toLocaleString() }} USD)</div>
          <div>Max diff is {{ maxCoin.name }} ({{ maxCoin.change24h.toLocaleString() }} USD)</div>
          <div>Total change (24h): {{ allChange24h.toLocaleString() }} USD</div>
        </div>
      </div>
      <div class="table-padding">
        <h3 class="subtitle"><center>LibreBank Fund Assests:</center></h3>
        <status-coins :tableData='coinsData'></status-coins>
      </div>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
    </section>
</template>

<script>
import StatusCoins from '@/components/StatusCoins'
import Config from '@/config'
export default {
  data () {
    return {
      coinsData: [],
      statisticsData: [],
      allBalances: 0,
      allChange24h: 0,
      maxCoin: {name:'',change24h:0},
      minCoin: {name:'',change24h:0},
      isLoading: false,
    }
  },
  methods: {
    async getBalancesData () {
      this.coinsData = []
      this.isLoading = true

      var coins = Config.balance.coins

      let
        response = await axios.get(Config.balance.coinmarketcap.request(0)).catch(e => 'error'),
        nameCoins = coins.map((coin) => coin.name),
        countFind = 0,
        maxCoin, minCoin;

      if (response !== 'error') {
        for (let i = 0; i < response.data.length; i++) {
          let
            coin = response.data[i],
            index = nameCoins.indexOf(coin.symbol)

          if (index >= 0) {
            coins[index].price = coin.price_usd
            coins[index].change24h = +coin.percent_change_24h

            if (coins.length === ++countFind) {
              break
            }
          }
        }

        this.allChange24h = this.allBalances = 0
        let resolves = await Promise.all(coins.map((coin) => axios.get(coin.request(coin.address))
              .catch(e => 'error')));

        for (let i = 0; i < coins.length; i++) {
          if (resolves[i] != 'error') {
            coins[i].balance = coins[i].process(resolves[i].data)
            coins[i].balanceUSD = Math.round(coins[i].price * coins[i].balance * 100) / 100
            this.allBalances += coins[i].balanceUSD
            coins[i].change24h = Math.round(coins[i].balanceUSD * coins[i].change24h /(100 + coins[i].change24h) * 100 ) / 100
            this.allChange24h += coins[i].change24h

            if (maxCoin == undefined || (maxCoin.change24h < coins[i].change24h))
              maxCoin = coins[i]

            if (minCoin == undefined || (minCoin.change24h > coins[i].change24h))
              minCoin = coins[i]

          } else {
            coins[i].change24h = coins[i].balance = coins[i].balanceUSD = '-'
          }

          this.coinsData.push({
            name: coins[i].name,
            balance: coins[i].balance,
            balanceUSD: coins[i].balanceUSD.toLocaleString(),
            change24h: coins[i].change24h.toLocaleString(),
            href: coins[i].href(coins[i].address)
          })
        }

        this.coinsData.push({
          name: 'Total:',
          balanceUSD: this.allBalances.toLocaleString(),
          change24h: this.allChange24h.toLocaleString()
        })
      }

      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(this.drawChart);

      this.maxCoin = maxCoin;
      this.minCoin = minCoin;

      this.isLoading = false
    },

    drawChart() {
      var peiData = [['Coin','USD']];
      Config.balance.coins.forEach(coin => {
        if (coin.balanceUSD !== '-')
          peiData.push([coin.name, coin.balanceUSD])
      })
        var data = google.visualization.arrayToDataTable(peiData);

        var options = {
          title: 'Coins proportion',
          chartArea:{left:40,top:0,width:'100%',height:'100%'}
        };

      var chart = new google.visualization.PieChart(document.getElementById('piechart'));

      chart.draw(data, options);
    }
  },
  created () {
    try {
      this.getBalancesData()
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    StatusCoins
  }
}
</script>