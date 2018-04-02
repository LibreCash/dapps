
<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">Loans</h2>
      </div>
      <br>
      <div class="table-padding">
        <address-block>one</address-block>
        <div>Loans contract address: {{ loansAddress }}</div>
        <div>Current time: {{ new Date(curBlockchainTime * 1000).toLocaleString() }}</div>
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
        </div>
        <br>
        <div v-if="loansCount == 0 || searchData.length == 0">
          No loans for selected filter
        </div>
        <loans-table v-if="searchData.length > 0" :tableData='searchData'></loans-table>
        <b-pagination
            @change="loadLoans(false)"
            :total="loansCount"
            :current.sync="vpage"
            :simple="isSimple"
            :order="paginationOrder"
            :rounded="isRounded"
            :per-page="perPage">
        </b-pagination>
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
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
    </section>
    </div>
</template>



<script>
import LoansTable from '@/components/LoansTable'
import AddressBlock from '@/components/AddressBlock'
import Config from '@/config'
export default {
  data () {
    return {
      vtype: 'ETH',
      loansAddress: '',
      reportText: '',
      searchData: [],
      isLoading: false,
      isSimple: false,
      isRounded: true,
      paginationOrder: 'is-centered',
      defaultAddress: '',
      tokensCount: '',
      pages: [1],
      vpage: 1,
      ethType: 'ETH',
      isActive: true,
      isUsed: false,
      isCompleted: false,
      isMine: false,
      loansCount: 0,
      perPage: 10,
      curBlockchainTime: 0
    }
  },
  methods: {
    async loadLoans (resetPage = true) {
      console.log("res", resetPage)
      this.defaultAddress = window.web3.eth.defaultAccount;
      this.loansAddress = Config.loans.address;
      this.searchData = [];
      if (!this.isActive && !this.isUsed && !this.isCompleted) {
        return;
      }
      if (resetPage) this.vpage = 1;
      console.log(this.vpage)
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
        this.loansCount = +await this.$libre.loans.getLoanCount(_type, offers);
        let loanIDs = await this.$libre.loans.getLoans([_page - 1, pageCount], _type, offers);
        let pages = Math.ceil(this.loansCount / pageCount);
        this.pages = Array.from(Array(pages)).map((e, i) => i + 1);
        let activeProposalShown = 0;
        for (var i = 0; i < loanIDs.length; i++) {
          // do not use forEach - we do not want async iterations
          if (+loanIDs[i] === maxUINT256) continue;
          var 
            loan = this.$libre.getLoanObject((this.ethType === "ETH") ?
              await this.$libre.loans.getLoanEth(loanIDs[i]) :
              await this.$libre.loans.getLoanLibre(loanIDs[i]));
          var loanData = loan[struct.data.outer];
          this.searchData.push({
              id: loanIDs[i],
              type: Object.keys(this.$libre.loansType)[_type],
              holder: loan.holder,
              recipient: this.$eth.isZeroAddress(loan.recipient) ? '-' : loan.recipient,
              timestampUnix: loan.timestamp,
              timestamp: new Date(loan.timestamp * 1000).toLocaleString(),
              period: new Date((loan.timestamp + loan.period) * 1000).toLocaleString(),
              amount: this.$eth.fromWei(loan.amount),
              margin: this.$eth.fromWei(loan.margin),
              refund: this.$eth.fromWei(loan.refund),
              status: loan.status
          })
        }
      } catch (err) {
        console.log(err)
      }

      this.isLoading = false
    },
    async updateBlockTime() {
      this.curBlockchainTime = +(await this.$eth.getLatestBlockTime())
    },

    startUpdatingTime() {
      this.curBlockchainTime = 0
      this.updatingTicker = setInterval(() => {
        this.curBlockchainTime++
      }, 1000)
      this.updatingBlockData = setInterval(() => {
        this.updateBlockTime()
      }, 10 * 60 * 1000 /* 10 minutes */)
      this.updateBlockTime()
    },
    clearTimers() {
      let intervals = [
        this.updatingTicker,
        this.updatingBlockData,
        this.updateTableData
      ]

      intervals.forEach((interval) => clearInterval(interval))
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.startUpdatingTime();
      this.loadLoans()
    } catch (err) {
      console.log(err)
    }
  },
  destroyed () {
    this.clearTimers();
  },
  components: {
    LoansTable,
    AddressBlock
  }
}
</script>