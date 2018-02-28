<template>
  <div id="proposal-dao">
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
        <b-table-column label='Type' centered>
          {{ props.row.type }}
        </b-table-column>
        <b-table-column label='Date' centered>
          {{ props.row.date }}
        </b-table-column>
        <b-table-column label='State' centered>
          {{ props.row.state }}
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
      perPage: 5
    }
  }
}
</script>

