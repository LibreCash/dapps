
<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">Loans</h2>
      </div>
      <br>
      <div class="table-padding">
        <div>Loans contract address: {{ loansAddress }}</div>
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
      loansAddress: this.$eth.loansAddress(),
      loansCount: [0, 0],
      reportText: '',
      owner: false,
      reportNumber: 0,
      searchData: [],
      isLoading: false,
      defaultAddress: window.web3.eth.defaultAccount,
      tokensCount: ''
    }
  },
  methods: {
    async loadLoansCount () {
      this.loansCount = await this.$eth.getLoansCount()
    },
    async loadLoans (_type) {
      const struct = this.$libre.loansStruct

      this.searchData = [],
      this.isLoading = true
      try {
        let localLoansCount = this.loansCount[_type];
        let activeProposalShown = 0
        for (let i = localLoansCount - 1; i >= 0; --i) {
          var 
            loan = await this.$eth.getLoanEth(i)
          {
            if (++activeProposalShown == 10) this.isLoading = false
            this.searchData.push({
                id: i,
                type: Object.keys(this.$libre.loansType)[_type],
                holder: loan[struct.holder],
                recipient: loan[struct.recipient],
                timestamp: loan[struct.timestamp],
                period: loan[struct.period],
                amount: loan[struct.amount],
                margin: loan[struct.margin],
                refund: loan[struct.refund],
                status: loan[struct.status]
            })
          }
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
      this.loadLoans(this.$libre.loansType.eth)
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    LoansTable
  }
}
</script>