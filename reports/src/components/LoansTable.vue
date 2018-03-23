<template>
  <div id="LoansTable" class="table-padding">
    <b-message type="is-warning" v-if="needUpdate">
      The table isn't actual. Please update the page
    </b-message>
    <b-table
      :data="isEmpty ? [] : tableData"
      :bordered="isBordered"
      :striped="isStriped"
      :narrowed="isNarrowed"
      :loading="isLoading"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :pagination-simple="isPaginationSimple"
      :mobile-cards="hasMobileCards"
      :responsive="isResponsive">
      <template slot-scope="props" v-if="!props.row.tempHide">
        <b-table-column label='Type' centered>
          {{ props.row.type }}
        </b-table-column>
        <b-table-column label='Date' centered>
          {{ props.row.timestamp }}
        </b-table-column>
        <b-table-column label='Loan Period' centered>
          {{ props.row.p }}
        </b-table-column>
        <b-table-column label='Amount' centered>
          {{ props.row.amount }}
        </b-table-column>
        <b-table-column label='Margin' centered>
          {{ props.row.margin }}
        </b-table-column>
        <b-table-column label='Refund' centered>
          {{ props.row.refund }}
        </b-table-column>
        <b-table-column label='Status' centered>
          {{ props.row.refund }}
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
      isPaginated: true,
      isPaginationSimple: false,
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
