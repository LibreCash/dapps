<template>
  <div id="DaoProposal">
    <b-table
      :data="isEmpty ? [] : tableData"
      :bordered="isBordered"
      :striped="isStriped"
      :narrowed="isNarrowed"
      :loading="isLoading"
      :mobile-cards="hasMobileCards">
      <template slot-scope="props">
        <b-table-column field="report.type" label='Type' centered>
          {{ props.row.type }}
        </b-table-column>
        <b-table-column label='Recipient' centered>
          {{ props.row.recipient }}
        </b-table-column>
        <b-table-column field="report.amount" label='Amount' centered>
          {{ props.row.amount }}
        </b-table-column>
        <b-table-column label='Desription' centered>
          {{ props.row.description }}
        </b-table-column>
        <b-table-column label='Votes Data' centered>
          {{ props.row.votingData.yea }} / {{ props.row.votingData.nay }}
        </b-table-column>
         <b-table-column label='Deadline' centered>
          {{ props.row.deadline }}
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
      isPaginated: true,
      isPaginationSimple: false,
      currentPage: 1,
      perPage: 5
    }
  }
}
</script>

