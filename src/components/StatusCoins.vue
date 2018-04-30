<template>
  <div id="status-coins">
    <b-table
      :data="isEmpty ? [] : tableData"
      :bordered="isBordered"
      :striped="isStriped"
      :narrowed="isNarrowed"
      :loading="isLoading"
      :paginated="isPaginated"
      :hoverable="isHoverable"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :pagination-simple="isPaginationSimple"
      :mobile-cards="hasMobileCards">
      <template slot-scope="props">
        <b-table-column field="report.date" :label="$t('lang.common.currency')" centered>
          <a :href="props.row.href" target="_blank" v-if="props.row.href">{{ props.row.name }}</a>
          <span v-else>{{ props.row.name }}</span>
        </b-table-column>
        <b-table-column :label="$t('lang.common.amount')" centered>
          {{ props.row.balance }}
        </b-table-column>
        <b-table-column :label="$t('lang.common.amount-usd')" centered>
          {{ props.row.balanceUSD }}
        </b-table-column>
        <b-table-column :label="$t('lang.fund-status.change-usd')" centered>
          {{ props.row.change24h }}
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
      isBordered: true,
      isStriped: true,
      isNarrowed: true,
      isHoverable: true,
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

