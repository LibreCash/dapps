/* eslint-disable-one-var */
<template>
  <div class="max-width">
    <div class="level"></div>
    <div class="container table-padding max-width">
      <div class="columns">
        <div class="column is-6">
          <div class="card bm--card-equal-height">
            <header class="card-header">
              <p class="card-header-title">{{ $t('lang.status.overall-stats') }}</p>
            </header>
            <div class="card-content">
              <div class="content">
                <div class="level">
                  <div class="level-item level-left">
                    <div class="tags has-addons is-large">
                      <span class="tag is-md">{{ $t('lang.status.minimum-change') }}:</span>
                      <span class="tag is-info is-md">{{ minCoin.name }}</span>
                      <span class="tag is-md" :class="minCoin.change24h >= 0 ? 'is-success' : 'is-danger'">{{ minCoin.change24h.toLocaleString()}} USD</span>
                    </div>
                  </div>
                </div>

                <div class="level">  
                  <div class="level-item level-left">
                    <div class="tags has-addons is-md">
                      <span class="tag is-md">{{ $t('lang.status.maximum-change') }}:</span>
                      <span class="tag is-info is-md">{{ maxCoin.name }}</span>
                      <span class="tag is-md" :class="maxCoin.change24h >= 0 ? 'is-success' : 'is-danger'">{{ maxCoin.change24h.toLocaleString()}} USD</span>
                    </div>
                  </div>
                </div>

                <div class="level"> 
                  <div class="level-item level-left">
                    <div class="tags has-addons is-md">
                      <span class="tag is-md">{{ $t('lang.status.total-change') }}:</span>
                      <span class="tag is-md" :class="allChange24h >= 0 ? 'is-success' : 'is-danger'">{{ allChange24h.toLocaleString()}} USD</span>
                    </div>
                  </div>
                </div>

                <div class="level"> 
                  <div class="level-item level-left">
                    <div class="tags has-addons is-md">
                      <span class="tag is-md">{{ $t('lang.status.total-issued') }}:</span>
                      <span class="tag is-info is-md">{{ totalIssued.toLocaleString()}} Libre</span>
                    </div>
                  </div>
                </div>

                <div class="level"> 
                  <div class="level-item level-left">
                    <div class="tags has-addons is-md">
                      <span class="tag is-md">{{ $t('lang.status.reserve-percent') }}:</span>
                      <span class="tag is-info is-md">{{ reservePercent.toLocaleString()}} %</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="column is-6">
          <div class="card bm--card-equal-height">
            <header class="card-header">
              <p class="card-header-title">{{ $t('lang.status.overall-stats') }}</p>
            </header>
             <div class="card-content">
              <div class="content chart">
                <pie-chart :coins="pieChart" />
              </div>
             </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container table-padding max-width">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">{{ $t('lang.status.fund-assets') }}</p>
      </header>
      <div class="card-content">
        <h2 class="has-text-centered">{{ $t('lang.status.sample-data') }}</h2>
        <status-coins :tableData='coinsData' />
      </div>
    </div>
    <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
  </div>
  </div>
</template>

<style>
.chartjs-size-monitor {
  height: 100%;
  max-height: 300px;
  max-width: 100%;
}
</style> 
<script>
  import StatusCoins from '@/components/StatusCoins'
  import PieChart from '@/components/PieChart'
  import axios from 'axios'
  export default {
    data() {
      return {
        coinsData: [],
        statisticsData: [],
        allBalances: 0,
        allChange24h: 0,
        reservePercent: '',
        totalIssued: 0,
        maxCoin: {
          name: "",
          change24h: 0
        },
        minCoin: {
          name: "",
          change24h: 0
        },
        isLoading: false,
        pieChart: undefined,
        
      };
    },
  
    methods: {
      async getBalancesData() {
        this.coinsData = [];
        this.isLoading = true;

        this.totalIssued =  this.$eth.toToken(await this.$libre.token.totalSupply());

        var coins = this.config.balance.coins;

        let response = await axios
          .get(this.config.balance.coinmarketcap.request(0))
          .catch(e => "error"),
          nameCoins = coins.map(coin => coin.symbol || coin.name),
          countFind = 0,
          maxCoin,
          minCoin;
        if (response !== "error") {
          for (let i = 0; i < nameCoins.length; i++) {
            let index = response.data.findIndex(x => x.symbol === nameCoins[i]);
            if (index >= 0) {
              coins[i].price = response.data[index].price_usd;
              coins[i].change24h = +response.data[index].percent_change_24h;
            }
          }

          this.allChange24h = this.allBalances = 0;
          let resolves = await Promise.all(
            coins.map(coin =>
              axios.get(coin.request(coin.address)).catch(e => "error")
            )
          );

          for (let i = 0; i < coins.length; i++) {
            if (resolves[i] != "error") {
              coins[i].balance = coins[i].process(resolves[i].data);
              coins[i].balanceUSD =
                Math.round(coins[i].price * coins[i].balance * 100) / 100;
              this.allBalances += coins[i].balanceUSD;
              coins[i].change24h =
                Math.round(
                  coins[i].balanceUSD *
                  coins[i].change24h /
                  (100 + coins[i].change24h) *
                  100
                ) / 100;
              this.allChange24h += coins[i].change24h;

              if (maxCoin == undefined || maxCoin.change24h < coins[i].change24h)
                maxCoin = coins[i];

              if (minCoin == undefined || minCoin.change24h > coins[i].change24h)
                minCoin = coins[i];
            } else {
              coins[i].change24h = coins[i].balance = coins[i].balanceUSD = "-";
            }

            this.coinsData.push({
              name: coins[i].name,
              balance: coins[i].balance,
              balanceUSD: coins[i].balanceUSD.toLocaleString(),
              change24h: coins[i].change24h.toLocaleString(),
              href: coins[i].href(coins[i].address)
            });
          }

          this.coinsData.push({
            name: this.$t('lang.status.total'),
            balanceUSD: this.allBalances.toLocaleString(),
            change24h: this.allChange24h.toLocaleString()
          });

          this.reservePercent =  (this.allBalances / this.totalIssued * 100).toFixed(2);
        }

        this.pieChart = coins;
        this.maxCoin = maxCoin;
        this.minCoin = minCoin;
        this.isLoading = false;
      }
    },

    async created() {
      try {
        await this.$eth.accountPromise,
        await this.$libre.initPromise,
        await this.getBalancesData()
      } catch (err) {
        console.log(err);
      }
    },

    components: {
      StatusCoins,
      PieChart
    }
  };
</script>