<template>
  <div id="DaoTable">
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
        <b-table-column label='Actions' centered>
          <router-link :to="{name: 'DAO Proposal', params: { id: props.row.id }}">info</router-link>
          <button v-on:click="yea(props.row.id)">+</button>
          <button v-on:click="nay(props.row.id)">-</button>
        </b-table-column>

      </template>
      </b-table>
  </div>
</template>

<script>
export default {
  props: ['tableData'],
  methods: {
    yea: async function(id) {
      console.log(this.$eth.voteForProposal)
      this.$eth.voteForProposal(id, true).then(async (hash) => {
        //await this.$eth.getReceipt(hash)
        console.log(hash)
      });
    },
    nay: async function(id) {
      this.$eth.voteForProposal(id, false).then((hash) => {
        console.log(hash)
      });
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
      currentPage: 1,
      perPage: 5
    }
  }
}
</script>

