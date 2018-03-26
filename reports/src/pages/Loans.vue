
<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">Loans</h2>
      </div>
      <br>
      <div class="table-padding">
        <div>Loans contract address: {{ loansAddress }}</div>
        <div>
          <b-field>
            <b-radio-button v-model="ethType" native-value="ETH" type="is-success" @input="vpage=1;loadLoans()">ETH</b-radio-button>
            <b-radio-button v-model="ethType" native-value="Libre" type="is-success" checked @input="vpage=1;loadLoans()">Libre</b-radio-button>
          </b-field>
          <b-switch v-model="isActive" @input="vpage=1;loadLoans()">active</b-switch>
          <b-switch v-model="isUsed" @input="vpage=1;loadLoans()">used</b-switch>
          <b-switch v-model="isCompleted" @input="vpage=1;loadLoans()">completed</b-switch>
          <b-field>
            <b-radio-button v-model="vpage" v-for="page in pages" :native-value="page" type="is-success" @input="loadLoans()">{{page}}</b-radio-button>
          </b-field>
        </div>
      </div>
      <br>
      <loans-table :tableData='searchData'></loans-table>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
    </section>
    </div>
</template>



<script>
import LoansTable from '@/components/LoansTable'
import libre from '@/plugins/libre'
import config from '@/config'
export default {
  data () {
    return {
      vtype: 'ETH',
      loansAddress: this.$eth.loansAddress(),
      loansCount: [0, 0],
      reportText: '',
      owner: false,
      reportNumber: 0,
      searchData: [],
      isLoading: false,
      defaultAddress: window.web3.eth.defaultAccount,
      tokensCount: '',
      pages: [1, 2],
      vpage: 1,
      ethType: 'ETH',
      isActive: true,
      isUsed: false,
      isCompleted: false
    }
  },
  methods: {
    async loadLoansCount () {
      this.loansCount = await this.$eth.getLoansCount()
    },
    async loadLoans () {
      console.log("ETHTYPE", this.ethType)
      if (!this.isActive && !this.isUsed && !this.isCompleted) {
        this.isActive = true;
      }
      let offers = +this.isActive * 1 + +this.isUsed * 2 + +this.isCompleted * 4;
      let _type = (this.ethType === 'ETH') ? 1 : 0;
      console.log("offers", offers)
      console.log("type", _type)

      const pageCount = 4;
      let
        //_type = this.$libre.loansType[this.vtype],
        _page = this.vpage,
        status = this.$libre.loansStatus;
      const struct = this.$libre.loansStruct

      this.searchData = [],
      this.isLoading = true
      try {
        let loansObject = await this.$eth.getLoans(_page - 1, pageCount, _type, offers);
        let localLoansCount = loansObject[1];
        let pages = Math.ceil(localLoansCount / pageCount);
        this.pages = Array.from(Array(pages)).map((e, i) => i + 1);
        let loanIDs = loansObject[0];
        let activeProposalShown = 0;
        for (var i = 0; i < loanIDs.length; i++) {
          // do not use forEach
          var 
            loan = (this.ethType === "ETH") ?
              await this.$eth.getLoanEth(loanIDs[i]) :
              await this.$eth.getLoanLibre(loanIDs[i]);
          console.log("loan", loan)
          if (loan[struct.holder] === '0x') continue;
          this.searchData.push({
              id: i,
              type: Object.keys(this.$libre.loansType)[_type],
              holder: loan[struct.holder],
              recipient: loan[struct.recipient] === '0x0000000000000000000000000000000000000000' ? '-' : loan[struct.recipient],
              timestampUnix: +loan[struct.timestamp],
              timestamp: new Date(loan[struct.timestamp] * 1000).toLocaleString(),
              period: new Date(loan[struct.timestamp] * 1000 + loan[struct.period] * 1000).toLocaleString(),
              amount: +this.$eth.fromWei(loan[struct.amount]),
              margin: +loan[struct.margin],
              refund: +loan[struct.refund],
              status: status[loan[struct.status]]
          })
        }
      } catch (err) {
        console.log(err)
      }

      this.isLoading = false
    }
  },
  async created () {
    try {
      await this.loadLoansCount();
      this.loadLoans()
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    LoansTable
  }
}
</script>