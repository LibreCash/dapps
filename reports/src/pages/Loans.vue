
<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">Loans</h2>
      </div>
      <br>
      <div class="table-padding">
        <div>Loans contract address: {{ loansAddress }}</div>
        <div>Address: {{ defaultAddress }}</div>
        <router-link :to="{ path: '/dao/new_offer' }" class="button is-primary">New Offer</router-link>
        <div>
          <b-field>
            <b-radio-button v-model="ethType" native-value="ETH" type="is-success" @input="loadLoans()">ETH</b-radio-button>
            <b-radio-button v-model="ethType" native-value="Libre" type="is-success" checked @input="loadLoans()">Libre</b-radio-button>
          </b-field>
          <b-switch v-model="isActive" @input="loadLoans()">active</b-switch>
          <b-switch v-model="isUsed" @input="loadLoans()">used</b-switch>
          <b-switch v-model="isCompleted" @input="loadLoans()">completed</b-switch>
          <b-switch v-model="isMine" @input="loadLoans()">mine</b-switch>
          
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
      <div v-if="loansCount == 0 || searchData.length == 0" class="table-padding">
        No loans for selected filter
      </div>
      <loans-table v-if="searchData.length > 0" :tableData='searchData'></loans-table>
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
      reportText: '',
      owner: false,
      reportNumber: 0,
      searchData: [],
      isLoading: false,
      defaultAddress: window.web3.eth.defaultAccount,
      tokensCount: '',
      pages: [1],
      vpage: 1,
      ethType: 'ETH',
      isActive: true,
      isUsed: false,
      isCompleted: false,
      isMine: false,
      loansCount: 0,
      perPage: 10
    }
  },
  methods: {
    async loadLoans (resetPage = true) {
      this.searchData = [];
      if (!this.isActive && !this.isUsed && !this.isCompleted) {
        return;
      }
      if (resetPage) this.vpage = 1;
      let offers = +this.isActive * 1 + +this.isUsed * 2 + +this.isCompleted * 4 +this.isMine * 8;
      let _type = (this.ethType === 'ETH') ? 1 : 0;

      const pageCount = this.perPage;
      const maxUINT256 = 2**256 - 1;
      let
        _page = this.vpage,
        status = this.$libre.loansStatus;
      const struct = this.$libre.loansStruct

      this.isLoading = true
      try {
        this.loansCount = await this.$eth.getLoanCount(_type, offers);
        let loanIDs = await this.$eth.getLoans([_page - 1, pageCount], _type, offers);
        let pages = Math.ceil(this.loansCount / pageCount);
        this.pages = Array.from(Array(pages)).map((e, i) => i + 1);
        let activeProposalShown = 0;
        for (var i = 0; i < loanIDs.length; i++) {
          // do not use forEach - we do not want async iterations
          if (+loanIDs[i] === maxUINT256) continue;
          var 
            loan = (this.ethType === "ETH") ?
              await this.$eth.getLoanEth(loanIDs[i]) :
              await this.$eth.getLoanLibre(loanIDs[i]);
          var loanData = loan[struct.data.outer];
          this.searchData.push({
              id: loanIDs[i],
              type: Object.keys(this.$libre.loansType)[_type],
              holder: loan[struct.holder],
              recipient: loan[struct.recipient] === '0x0000000000000000000000000000000000000000' ? '-' : loan[struct.recipient],
              timestampUnix: +loanData[struct.data.timestamp],
              timestamp: new Date(loanData[struct.data.timestamp] * 1000).toLocaleString(),
              period: new Date(loanData[struct.data.timestamp] * 1000 + loanData[struct.data.period] * 1000).toLocaleString(),
              amount: +this.$eth.fromWei(loanData[struct.data.amount]),
              margin: +loanData[struct.data.margin],
              refund: +this.$eth.fromWei(loanData[struct.data.refund]),
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