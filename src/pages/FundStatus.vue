/* eslint-disable-one-var */
<template>
  <section class="allMain">
  
    <div class="h2-contain">
  
      <h2 class="subtitle">LibreBank Fund Status</h2>
  
    </div>
  
    <br>
  
    <div class="container">
  
  
  
      <div class="columns">
  
        <div class="column">
  
          <div class="card">
  
            <header class="card-header">
  
              <p class="card-header-title">Overall stats</p>
            </header>
  
            <div class="card-content">
  
              <div class="content">
  
                <div class="level">
  
                  <div class="level-item level-left">
  
                    <div class="tags has-addons is-large">
  
                      <span class="tag is-md">Minimum change:</span>
  
                      <span class="tag is-success is-md">{{ minCoin.name }}</span>
  
                      <span class="tag is-info is-md">{{ minCoin.change24h.toLocaleString()}} USD</span>
  
                    </div>
  
                  </div>
  
                </div>
  
  
  
                <div class="level">
  
                  <div class="level-item level-left">
  
                    <div class="tags has-addons is-md">
  
                      <span class="tag is-md">Maximum change:</span>
  
                      <span class="tag is-success is-md">{{ maxCoin.name }}</span>
  
                      <span class="tag is-info is-md">{{ maxCoin.change24h.toLocaleString()}} USD</span>
  
                    </div>
  
                  </div>
  
                </div>
  
  
  
                <div class="level">
  
                  <div class="level-item level-left">
  
                    <div class="tags has-addons is-md">
  
                      <span class="tag is-md">Total change (24h):</span>
  
                      <span class="tag is-info is-md">{{ allChange24h.toLocaleString()}} USD</span>
  
                    </div>
  
                  </div>
  
                </div>
  
              </div>
  
            </div>
  
  
  
          </div>
  
        </div>
      </div>
      </div>
      <div class="container">

        <div class="card">
  
          <header class="card-header">
  
            <p class="card-header-title">LibreBank Fund Assests</p>
            
          </header>
  
          <div class="card-content">
            <h2 class="has-text-centered">THIS IS A SAMPLE DATA</h2>
            <status-coins :tableData='coinsData'></status-coins>
  
          </div>
  
        </div>
  
  
  
      </div>
  
    </div>
    </div>
  
  
  
    <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
  
  </section>
</template>


<script>
  import StatusCoins from "@/components/StatusCoins";
  
  import Config from "@/config";
  
  export default {
  
    data() {
  
      return {
  
        coinsData: [],
  
        statisticsData: [],
  
        allBalances: 0,
  
        allChange24h: 0,
  
        maxCoin: {
  
          name: "",
  
          change24h: 0
  
        },
  
        minCoin: {
  
          name: "",
  
          change24h: 0
  
        },
  
        isLoading: false
  
      };
  
    },
  
    methods: {
  
      async getBalancesData() {
  
        this.coinsData = [];
  
        this.isLoading = true;
  
  
  
        var coins = Config.balance.coins;
  
  
  
        let response = await axios
  
          .get(Config.balance.coinmarketcap.request(0))
  
          .catch(e => "error"),
  
          nameCoins = coins.map(coin => coin.name),
  
          countFind = 0,
  
          maxCoin,
  
          minCoin;
  
  
  
        if (response !== "error") {
  
          for (let i = 0; i < response.data.length; i++) {
  
            let coin = response.data[i],
  
              index = nameCoins.indexOf(coin.symbol);
  
  
  
            if (index >= 0) {
  
              coins[index].price = coin.price_usd;
  
              coins[index].change24h = +coin.percent_change_24h;
  
  
  
              if (coins.length === ++countFind) {
  
                break;
  
              }
  
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
  
            name: "Total:",
  
            balanceUSD: this.allBalances.toLocaleString(),
  
            change24h: this.allChange24h.toLocaleString()
  
          });
  
        }
  
  

  
  
  
        this.maxCoin = maxCoin;
  
        this.minCoin = minCoin;
  
  
  
        this.isLoading = false;
  
      },
  
  
  
      drawChart() {
  
        var peiData = [
  
          ["Coin", "USD"]
  
        ];
  
        Config.balance.coins.forEach(coin => {
  
          if (coin.balanceUSD !== "-") peiData.push([coin.name, coin.balanceUSD]);
  
        });
  
        var data = google.visualization.arrayToDataTable(peiData);
  
  
  
        var options = {
  
          title: "Fund Structure",
  
          chartArea: {
  
            width: "280px",
  
            height: "50px"
  
          }
  
        };
  
  
  
        var chart = new google.visualization.PieChart(
  
          document.getElementById("piechart")
  
        );
  
  
  
        chart.draw(data, options);
  
      }
  
    },
  
    async created() {
  
      try {
  
        await this.$eth.accountPromise;
  
        await this.$libre.initPromise;
  
        this.getBalancesData();
  
      } catch (err) {
  
        console.log(err);
  
      }
  
    },
  
    components: {
  
      StatusCoins
  
    }
  
  };
</script>