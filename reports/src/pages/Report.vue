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
				<li class="active">
					<a href="#">
						<div class="Rectangle"></div>
						<span>Reports</span>
					</a>
				</li>
				<li>
					<a href="#">
						<div class="Rectangle"></div>
						<span>Analytics</span>
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
				<li>
					<a href="#">
						Условия предоставления услуг
					</a>
				</li>
				<li>
					<a href="#">				
						Политика конфиденциальности
					</a>
				</li>		
				<li>
					<a href="#">
						О системе
					</a>
				</li>		
			</ul>
		</div>
	
    <section v-if="owner" class="">
      <b-field>
        <b-input
          v-model="reportText"
          type="input"
          placeholder='Write Report'>
        </b-input>
      </b-field>
      <a class="button is-info" v-on:click="newReport">Submit</a>
    </section>
    <section class="allMain">
      <div class="h2-contain">			 
		<h2 class="subtitle">Reports History</h2>
      </div>
        <search-results :tableData='searchData'></search-results>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
    </section>
  </div>
</template>



<script>
import SearchResults from '@/components/SearchResults'
import BRadioButton from 'buefy/src/components/radio/RadioButton'
export default {
  data () {
    return {
      reportAddress: this.$eth.reportAddress,
      reportText: '',
      owner: false,
      reportNumber: 0,
      searchData: [],
      isLoading: false
    }
  },
  methods: {
    async search () {
      this.searchReports()
    },
    async newReport () {
      try {
        await this.$eth.addNewReport(this.reportText)
      } catch (err) {
        console.log(err)
      }
    },
    async searchReports () {
      this.searchData = []
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
          this.searchData.push({data: new Date(), report: `BTC balance ${balance}, price ${price}`});
        });

        axios.get('https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=NYWQ3JWMICSEVBIPHXWJNW6WQBNQEEZ94P')
        .then( response => {
          let balance = response.data.result;
          let price = data['ETH'].price_usd;
          this.searchData.push({data: new Date(), report: `ETH balance ${balance}, price ${price}`});
        });

        axios.get('https://blockdozer.com/insight-api/addr/19hZx234vNtLazfx5J2bxHsiWEmeYE8a7k/balance')
        .then( response => {
            let balance = response.data;
            let price = data['BCH'].price_usd;
            this.searchData.push({data: new Date(), report: `BCH balance ${balance}, price ${price}`});
        });

        axios.get('https://api.blockcypher.com/v1/ltc/main/addrs/3CDJNfdWX8m2NwuGUV3nhXHXEeLygMXoAj?limit=1')
        .then( response => {
            let balance = response.data.final_balance;
            let price = data['LTC'].price_usd;
            this.searchData.push({data: new Date(), report: `LTC balance ${balance}, price ${price}`});
        });

        axios.get('https://api.zcha.in/v2/mainnet/accounts/t3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd')
        .then( response => {
            let balance = response.data.balance;
            let price = data['ZEC'].price_usd;
            this.searchData.push({data: new Date(), report: `ZEC balance ${balance}, price ${price}`});
        });

        axios.get('http://explorer.zenmine.pro/insight-api-zen/addr/znaULW3nSEiuiMVa2P9WKXH6mxp4GpVvmpS/?noTxList=1')
        .then( response => {
            let balance = response.data.balance;
            let price = data['ZEN'].price_usd;
            this.searchData.push({data: new Date(), report: `ZEN balance ${balance}, price ${price}`});
        });
      });

      this.isLoading = false
    },
    async loadReport () {
      this.reportNumber = await this.$eth.reportCounter()
    },
    async loadETH () {
      this.isLoading = true
      try {
        await this.loadReport()
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },
    async checkOwner () {
      this.owner = await this.$eth.isOwner()
    }
  },
  created () {
    try {
      this.loadETH()
      this.loadReport()
      this.search()
      this.checkOwner()
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    SearchResults,
    BRadioButton
  }
}
</script>

