
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
            <b-radio-button v-model="ethType" native-value="ETH" type="is-success" @input="loadLoans()">ETH</b-radio-button>
            <b-radio-button v-model="ethType" native-value="Libre" type="is-success" checked @input="loadLoans()">Libre</b-radio-button>
          </b-field>
          <b-switch v-model="isActive" @input="loadLoans()">active</b-switch>
          <b-switch v-model="isUsed" @input="loadLoans()">used</b-switch>
          <b-switch v-model="isCompleted" @input="loadLoans()">completed</b-switch>
          <b-field>
            <b-radio-button v-model="vpage" v-for="page in pages" :native-value="page" type="is-success" @input="loadLoans(false)">{{page}}</b-radio-button>
          </b-field>
          <b-field label="per page">
            <b-select v-model="perPage" @input="loadLoans()">
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="300">300</option>
            </b-select>
          </b-field>
        </div>
      </div>
      <br>
      <div v-if="loansCount == 0">
        No loans for selected filter
      </div>
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
      isCompleted: false,
      loansCount: 0,
      perPage: 10
    }
  },
  methods: {
    async loadLoansCount () {
      this.loansCount = await this.$eth.getLoansCount()
    },
    async loadLoans (resetPage = true) {
      if (!this.isActive && !this.isUsed && !this.isCompleted) {
        this.isActive = true;
        return; // because a new instance of method is going on
      }
      if (resetPage) this.vpage = 1;
      let offers = +this.isActive * 1 + +this.isUsed * 2 + +this.isCompleted * 4;
      let _type = (this.ethType === 'ETH') ? 1 : 0;

      const pageCount = this.perPage;
      const maxUINT256 = 2**256 - 1;
      let
        //_type = this.$libre.loansType[this.vtype],
        _page = this.vpage,
        status = this.$libre.loansStatus;
      const struct = this.$libre.loansStruct

      this.searchData = [],
      this.isLoading = true
      try {
        let loansObject = await this.$eth.getLoans(_page - 1, pageCount, _type, offers);
        this.loansCount = loansObject[1];
        let pages = Math.ceil(this.loansCount / pageCount);
        this.pages = Array.from(Array(pages)).map((e, i) => i + 1);
        let loanIDs = loansObject[0];
        let activeProposalShown = 0;
        for (var i = 0; i < loanIDs.length; i++) {
          // do not use forEach - we do not want async iterations
          if (loanIDs[i] === maxUINT256) continue;
          var 
            loan = (this.ethType === "ETH") ?
              await this.$eth.getLoanEth(loanIDs[i]) :
              await this.$eth.getLoanLibre(loanIDs[i]);
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