
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
    async loadLoansEth () {
      const struct = this.$libre.loansStruct

      this.searchData = [],
      this.isLoading = true
      try {
        let loansCount = await this.$eth.getLoansCount()
        let libreLoansCount = loansCount[0],
            ethLoansCount = loansCount[1];
        let activeProposalShown = 0
        for (let i = ethLoansCount - 1; i > 0; --i) {
          var 
            loan = await this.$eth.getLoanEth(i)
          {
            if (++activeProposalShown == 10) this.isLoading = false
            this.searchData.push({
                id: i,
                type:'eth',
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
  created () {
    try {
      this.loadLoansEth()
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    LoansTable
  }
}
</script>