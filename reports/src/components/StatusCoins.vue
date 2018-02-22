<template>
  <div id="status-coins">
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
      :mobile-cards="hasMobileCards">
      <template slot-scope="props">
        <b-table-column field="report.date" label='Name' centered>
          <a :href="props.row.href" target="_blank">{{ props.row.name }}</a>
        </b-table-column>
        <b-table-column label='Balance' centered>
          {{ props.row.balance }}
        </b-table-column>
        <b-table-column label='Balance USD' centered>
          {{ props.row.balanceUSD }}
        </b-table-column>
      </template>
      </b-table>
  </div>
</template>

<script>
export default {
  props: ['tableData'],
  data () {
    return {
      isEmpty: false,
      isBordered: false,
      isStriped: true,
      isNarrowed: false,
      isLoading: false,
      hasMobileCards: true,
      isPaginated: false,
      isPaginationSimple: false,
      currentPage: 1,
      perPage: 100
    }
  }
}
</script>

