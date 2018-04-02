<template>
  <div id="LoansTable">
    <b-message type="is-warning" v-if="needUpdate">
      The table isn't actual. Please update the page
    </b-message>
    <b-table
      :data="isEmpty ? [] : tableData"
      :bordered="isBordered"
      :striped="isStriped"
      :narrowed="isNarrowed"
      :loading="isLoading"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :mobile-cards="hasMobileCards"
      :responsive="isResponsive">
      <template slot-scope="props" v-if="!props.row.tempHide">
        <b-table-column label='Holder' centered v-if="props.row.holder == '-'">
            not set
        </b-table-column>
        <b-table-column label='Holder' centered v-else>
          <a :href="'https://rinkeby.etherscan.io/address/'+props.row.holder">address</a>
        </b-table-column>
        <b-table-column label='Recipient' centered v-if="props.row.recipient == '-'">
            not set
        </b-table-column>
        <b-table-column label='Recipient' centered v-else>
          <a :href="'https://rinkeby.etherscan.io/address/'+props.row.recipient">address</a>
        </b-table-column>
        <b-table-column label='Date' centered>
          {{ props.row.timestamp }}
        </b-table-column>
        <b-table-column label='Loan Period' centered>
          {{ props.row.period }}
        </b-table-column>
        <b-table-column label='Amount' centered>
          {{ props.row.amount }} {{ props.row.type }}
        </b-table-column>
        <b-table-column label='Margin' centered>
          {{ props.row.margin }} {{ props.row.type }}
        </b-table-column>
        <b-table-column label='Refund' centered>
          {{ props.row.refund }} {{ props.row.type }}
        </b-table-column>
        <b-table-column label='Status' centered>
          {{ props.row.status }}
        </b-table-column>
        <b-table-column label='Actions' centered>
          <router-link :to="{name: 'Loan', params: { type: props.row.type, id: props.row.id }}" tag="button"><i class="mdi mdi-account-card-details"></i></router-link>
        </b-table-column>
      </template>
      </b-table>
  </div>
</template>

<script>
export default {
  props: ['tableData'],
  methods: {
    async updateBlockTime() {
      this.curBlockchainTime = +(await this.$eth.getLatestBlockTime())
    }
  },
  data () {
    return {
      isEmpty: false,
      isBordered: false,
      isStriped: true,
      isNarrowed: false,
      isLoading: false,
      hasMobileCards: true,
      isResponsive: true,
      currentPage: 1,
      perPage: 5,
      curBlockchainTime: 0,
      needUpdate: false,
      isOwner: false,
      contractOwner: null
    }
  }
}
</script>
