<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">{{ $route.params.type }} Loan #{{ $route.params.id }}</h2>
      </div>
      <br>
      <div class="table-padding">
        <button @click="$router.go(-1)" :to="{ path: '/loans' }" class="button">
          <b-icon icon="keyboard-return" size="is-small"></b-icon>&nbsp;&nbsp;&nbsp;&nbsp;Back
        </button>
        <span class="icon arrow-left"><i class="arrow-left"></i></span>
        <b-table :data="isEmpty ? [] : loanData"
          :bordered="isBordered"
          :striped="isStriped"
          :narrowed="isNarrowed"
          :loading="isLoading"
          :mobile-cards="hasMobileCards">
          <template slot-scope="props">
            <b-table-column label='Type'>
              <strong>{{ props.row.type }}</strong>
            </b-table-column>
            <b-table-column label='ID'>
              <strong>{{ props.row.id }}</strong>
            </b-table-column>
            <b-table-column label='Holder'>
              <a :href="'https://rinkeby.etherscan.io/address/'+props.row.holder">address</a>
            </b-table-column>
            <b-table-column label='Recipient' centered v-if="props.row.recipient == '-'">
              not set
            </b-table-column>
            <b-table-column label='Recipient' centered v-else>
              <a :href="'https://rinkeby.etherscan.io/address/'+props.row.recipient">address</a>
            </b-table-column>
            <b-table-column label='Timestamp'>
              <strong>{{ props.row.timestamp }}</strong>
            </b-table-column>
            <b-table-column label='Period'>
              <strong>{{ props.row.period }}</strong>
            </b-table-column>
            <b-table-column label='Amount'>
              <strong>{{ props.row.amount }} {{ props.row.type }}</strong>
            </b-table-column>
            <b-table-column label='Margin'>
              <strong>{{ props.row.margin }}</strong>
            </b-table-column>
            <b-table-column label='Refund'>
              <strong>{{ props.row.refund }} {{ props.row.type }}</strong>
            </b-table-column>
            <b-table-column label='Status' centered>
              {{ props.row.status }}
            </b-table-column>
          </template>
        </b-table>
        <div class="has-text-centered">
<!--          <button class="button is-success is-medium" v-on:click="vote(true)" :disabled="disVote"><i class="mdi mdi-check"></i></button>&nbsp;&nbsp;&nbsp;&nbsp;
          <button class="button is-danger is-medium" v-on:click="vote(false)" :disabled="disVote"><i class="mdi mdi-close"></i></button>
-->        </div>
        
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
      isPaginated: true,
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
            loan = this.$route.params.type == "ETH" ? await this.$eth.getLoanEth(this.$route.params.id):
                                                      await this.$eth.getLoanLibre(this.$route.params.id),
            zeroAddress = '0x0000000000000000000000000000000000000000';

          
          let data = loan[struct.data.outer];

          this.loanData.push({
              type: this.$route.params.type,
              id: this.$route.params.id,
              holder: loan[struct.holder],
              recipient: loan[struct.recipient] === zeroAddress ? '-' : loan[struct.recipient],
              timestampUnix: +data[struct.data.timestamp],
              timestamp: new Date(data[struct.data.timestamp] * 1000).toLocaleString(),
              period: new Date(data[struct.data.timestamp] * 1000 + data[struct.data.period] * 1000).toLocaleString(),
              amount: +this.$eth.fromWei(data[struct.data.amount]),
              margin: +data[struct.data.margin],
              refund: +this.$eth.fromWei(data[struct.data.refund]),
              status: status[loan[struct.status]]
          })
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