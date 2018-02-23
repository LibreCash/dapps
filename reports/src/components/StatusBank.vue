<template>
  <div id="status-bank">
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
        <b-table-column field="name" label='Name'>
          {{ props.row.name }}
        </b-table-column>
        <b-table-column label='Status' centered>
          <input class="address" v-if="props.row.type == 'input'" type="text" :value="props.row.data" disabled="disabled" size="30">
          <span v-else>{{ props.row.data }}</span>
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