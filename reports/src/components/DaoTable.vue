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
      :mobile-cards="hasMobileCards"
      :responsive="isResponsive">
      <template slot-scope="props">
        <b-table-column field="report.type" label='Type' centered>
          {{ props.row.type }}
        </b-table-column>
        <b-table-column label='Recipient' centered v-if="props.row.recipient == '-'">
            not set
        </b-table-column>
        <b-table-column label='Recipient' centered v-else>
          <a :href="'https://rinkeby.etherscan.io/address/'+props.row.recipient">address</a>
        </b-table-column>
        <b-table-column field="report.amount" label='Amount' centered>
          {{ props.row.amount }}
        </b-table-column>
        <b-table-column field="report.buffer" label='Buffer' centered>
          {{ props.row.buffer }}
        </b-table-column>
        <b-table-column label='Desription' centered>
          {{ props.row.description }}
        </b-table-column>
        <b-table-column label='Votes Data' centered>
          {{ props.row.yea }} / {{ props.row.nay }}
        </b-table-column>
         <b-table-column label='Deadline' centered>
          {{ props.row.deadline }}{{curBlockchainTime}}
        </b-table-column>
        <b-table-column label='Actions' centered>
          <router-link :to="{name: 'DAO Proposal', params: { id: props.row.id }}" tag="button"><i class="mdi mdi-account-card-details"></i></router-link>
          <span v-if="!props.row.votingData.voted && (props.row.deadlineUnix > curBlockchainTime)">
            <button v-on:click="vote(props.row.id, true, props.row.votingData)"><i class="mdi mdi-check"></i></button>
            <button v-on:click="vote(props.row.id, false, props.row.votingData)"><i class="mdi mdi-close"></i></button>
          </span>
          <span v-else-if="props.row.votingData.voted">
            voted
          </span>
          <span v-else>
            outdated
          </span>
        </b-table-column>
      </template>
      </b-table>
  </div>
</template>

<script>
export default {
  props: ['tableData'],
  methods: {
    vote: async function (id, support, votingData) {
      this.$eth.voteForProposal(id, support).then(async (hash) => {
        this.$eth.getReceipt(hash).then((result) => {
          if (+result.status === 1) {
            votingData.voted = true
            // TODO update info
          } else {
            console.log('else', result)
          }
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    updateBlockTime: function () {
      var that = this
      this.$eth.getLatestBlockTime().then(function (timestamp) {
        that.curBlockchainTime = +timestamp
      })
    },
    startUpdatingTime: function () {
      if (this.$eth.updatingByCycle) return
      this.$eth.updatingByCycle = true
      this.curBlockchainTime = 0
      var that = this
      this.updatingTicker = setInterval(function () {
        that.curBlockchainTime++
      }, 1000)
      this.updatingBlockData = setInterval(function () {
        that.updateBlockTime()
      }, 10 * 60 * 1000 /*10 minutes */)
      this.updateBlockTime()
    },
  },
  created () {
    this.startUpdatingTime()
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
      curBlockchainTime: 0
    }
  }
}
</script>

