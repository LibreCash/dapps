<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">{{ $route.params.type }} Loan #{{ $route.params.id }}</h2>
      </div>
      <br>
      <div class="table-padding">
        <button @click="$router.go(-1)" :to="{ path: '/loans' }" class="button">
          <b-icon icon="keyboard-return" size="is-small"></b-icon>
          <span>Back</span>
        </button>
        <span class="icon arrow-left"><i class="arrow-left"></i></span>
        <b-table :data="isEmpty ? [] : loanData"
          :bordered="isBordered"
          :striped="isStriped"
          :narrowed="isNarrowed"
          :loading="isLoading"
          :mobile-cards="hasMobileCards">
          <template slot-scope="props">
            <b-table-column>
              <strong>{{ props.row.name }}</strong>
            </b-table-column>
            <b-table-column centered>
              <input class="address" v-if="props.row.type == 'input'" type="text" :value="props.row.data" disabled="disabled" size="25">
              <span v-else>{{ props.row.data }}</span>
            </b-table-column>
          </template>
        </b-table>
      </div>
      
    </section>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loanId: this.$route.params.id,
      owner: false,
      loanData: [],
      isEmpty: false,
      isBordered: false,
      isStriped: true,
      isNarrowed: false,
      isLoading: false,
      hasMobileCards: true,
      isPaginated: false,
      isPaginationSimple: false,
      currentPage: 1,
      perPage: 5,
    }
  },
  methods: {
    async loadLoan () {
      const 
        struct = this.$libre.loansStruct,
        status = this.$libre.loansStatus;
    
      this.loanData = []
      this.isLoading = true

      try {
          let 
            loan = this.$route.params.type == "ETH" ? await this.$libre.loans.getLoanEth(this.$route.params.id): await this.$libre.loans.getLoanLibre(this.$route.params.id);

          
          let data = loan[struct.data.outer];

          this.loanData.push({name: 'Type', data: this.$route.params.type})
          this.loanData.push({name: 'ID', data: this.$route.params.id})
          this.loanData.push({name: 'Holder', data: loan[struct.holder], type: 'input'})
          this.loanData.push({name: 'Recipient', data: this.$eth.isZeroAddress(loan[struct.recipient]) ? '-' : loan[struct.recipient], type: this.$eth.isZeroAddress(loan[struct.recipient])? '':'input'})
          this.loanData.push({name: 'Timestamp', data: new Date(data[struct.data.timestamp] * 1000).toLocaleString()})
          this.loanData.push({name: 'period', data: new Date(data[struct.data.timestamp] * 1000 + data[struct.data.period] * 1000).toLocaleString()})
          this.loanData.push({name: 'amount', data: +this.$eth.fromWei(data[struct.data.amount])})
          this.loanData.push({name: 'margin', data: +data[struct.data.margin]})
          this.loanData.push({name: 'refund', data: +this.$eth.fromWei(data[struct.data.refund])})
          this.loanData.push({name: 'status', data: status[loan[struct.status]]})
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    }
  },
  created () {
    try {
      this.loadLoan()
    } catch (err) {
      console.log(err)
    }
  }
}
</script>