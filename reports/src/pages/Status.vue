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
      <h2>Balances</h2>
      <status-coins :tableData='coinsData'></status-coins>
      <h3 class="subtitle">Exchanger status</h3>
      <status-bank :tableData='exchangerData'></status-bank>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
    </section>
	</div>
</template>

<script>
import StatusCoins from '@/components/StatusCoins'
import StatusBank from '@/components/StatusBank'
//import BRadioButton from 'buefy/src/components/radio/RadioButton'
export default {
  data () {
    return {
      reportAddress: this.$eth.reportAddress,
      reportText: '',
      owner: false,
      reportNumber: 0,
      coinsData: [],
      exchangerData: [],
      isLoading: false
    }
  },
  methods: {
    async getBalancesData () {
      this.coinsData = []
      this.isLoading = true
      
      var data = {};
      axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=200')
      .then( response => {
        response.data.forEach((coin) => {
            data[coin.symbol] = coin;
        });
      }).then(() => {
        axios.get('https://blockchain.info/ru/balance?active=167uvq9mW6jyELWx7wcjZbbERvNxnMwtKM')
        .then( response => {
          let balance = response.data['167uvq9mW6jyELWx7wcjZbbERvNxnMwtKM'].final_balance;
          let price = data['BTC'].price_usd;
          this.coinsData.push({name: 'BTC', balance: balance, balanceUSD: price});
        });

        axios.get('https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=NYWQ3JWMICSEVBIPHXWJNW6WQBNQEEZ94P')
        .then( response => {
          let balance = response.data.result;
          let price = data['ETH'].price_usd;
          this.coinsData.push({name: 'ETH', balance: balance, balanceUSD: price});
        });

        axios.get('https://blockdozer.com/insight-api/addr/19hZx234vNtLazfx5J2bxHsiWEmeYE8a7k/balance')
        .then( response => {
            let balance = response.data;
            let price = data['BCH'].price_usd;
            this.coinsData.push({name: 'BCH', balance: balance, balanceUSD: price});
        });

        axios.get('https://api.blockcypher.com/v1/ltc/main/addrs/3CDJNfdWX8m2NwuGUV3nhXHXEeLygMXoAj?limit=1')
        .then( response => {
            let balance = response.data.final_balance;
            let price = data['LTC'].price_usd;
            this.coinsData.push({name: 'LTC', balance: balance, balanceUSD: price});
        });

        axios.get('https://api.zcha.in/v2/mainnet/accounts/t3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd')
        .then( response => {
            let balance = response.data.balance;
            let price = data['ZEC'].price_usd;
            this.coinsData.push({name: 'ZEC', balance: balance, balanceUSD: price});
        });

        axios.get('http://explorer.zenmine.pro/insight-api-zen/addr/znaULW3nSEiuiMVa2P9WKXH6mxp4GpVvmpS/?noTxList=1')
        .then( response => {
            let balance = response.data.balance;
            let price = data['ZEN'].price_usd;
            this.coinsData.push({name: 'ZEN', balance: balance, balanceUSD: price});
        });
      });

      this.isLoading = false
    },

    async getStatusBank() {
        this.exchangerData.push({name: "Hello", data: "World!"});
    }
  },
  created () {
    try {
      this.getBalancesData();
      this.getStatusBank();
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    StatusCoins,
    StatusBank,
    //BRadioButton
  }
}
</script>