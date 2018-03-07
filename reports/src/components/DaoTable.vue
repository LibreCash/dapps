<template>
  <div id="DaoTable">
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
      <template slot-scope="props">
        <b-table-column field="report.type" label='Type' centered>
          {{ props.row.loading ? 'loading...' : props.row.type }}
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
        <b-table-column label='Description' centered>
          {{ props.row.description }}
        </b-table-column>
        <b-table-column label='Votes' centered>
          {{ props.row.yea }} / {{ props.row.nay }}
        </b-table-column>
         <b-table-column label='Deadline' centered>
          {{ props.row.deadline }}
        </b-table-column>
        <b-table-column label='Actions' centered>
          <router-link :to="{name: 'DAO Proposal', params: { id: props.row.id }}" tag="button"><i class="mdi mdi-account-card-details"></i></router-link>
          <span v-if="!props.row.votingData.voted && (props.row.deadlineUnix > curBlockchainTime) && !props.row.loading">
            <button v-on:click="vote(props.row, true)"><i class="mdi mdi-check"></i></button>
            <button v-on:click="vote(props.row, false)"><i class="mdi mdi-close"></i></button>
          </span>
          <span v-else-if="props.row.deadlineUnix <= curBlockchainTime">
            outdated
            <button v-on:click="execute(props.row)"><i class="mdi mdi-console"></i></button>
          </span>
          <span v-else-if="props.row.votingData.voted">
            voted
          </span>
          <span v-else>
            loading
          </span>
          <span v-if="isOwner">
            <button v-on:click="block(props.row)"><i class="mdi mdi-block-helper"></i></button>
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
    vote: async function (row, support) {
      var id = row.id,
          votingData = row.votingData;
      row.loading = true
      this.$eth.daoContract.vote(id, support).then(async (hash) => {
        return this.$eth.getReceipt(hash)
      }).then((result) => {
        if (+result.status === 1) {
          votingData.voted = true
          alert('vote tx ok')
        } else {
          alert('vote tx failed')
        }
        row.loading = false
        this.$eth.getVotingData(row.id).then((vData) => {
          row.yea = +vData.yea / 10**18
          row.nay = +vData.nay / 10**18
          row.votingData = vData
        })
      }).catch((err) => {
        alert(`error ${err} ${hash}`)
        row.loading = false
      })
    },
    block: async function (row) {
      console.log(row.id)
    },
    execute: async function (row) {
      var id = row.id
      row.loading = true
      this.$eth.daoContract.executeProposal(id).then(async (hash) => {
        return this.$eth.getReceipt(hash)
      }).then((result) => {
        if (+result.status === 1) {
          alert('execute proposal ok')
        } else {
          alert('execute proposal failed')
        }
        row.loading = false
      }).catch((err) => {
        alert(`error ${err} ${hash}`)
        row.loading = false
      })
    },
    updateBlockTime: function () {
      this.$eth.getLatestBlockTime().then((timestamp) => {
        this.curBlockchainTime = +timestamp
      })
    },
    startUpdatingTime: function () {
      this.curBlockchainTime = 0
      this.updatingTicker = setInterval(() => {
        this.curBlockchainTime++
      }, 1000)
      this.updatingBlockData = setInterval(() => {
        this.updateBlockTime()
      }, 10 * 60 * 1000 /*10 minutes */)
      this.updateBlockTime()
      this.numProposals = -1
      this.updateTableData = setInterval(async () => {
        var numProposals = +(await this.$eth.daoContract.numProposals())
        if (numProposals != this.numProposals && this.numProposals != -1) {
          this.needUpdate = true
          clearInterval(this.updateTableData)
        }
        if (this.numProposals == -1) {
          this.numProposals = numProposals
        }
      }, 60 * 1000)
    },
  },
  created () {
    this.startUpdatingTime()
    this.$eth.daoContract.owner().then((owner) => {
      this.contractOwner = owner
      var loginChecker = setInterval(() => {
        if (this.$eth.yourAccount != null) {
          clearInterval(loginChecker)
          if (owner == this.$eth.yourAccount) {
            this.isOwner = true
          } else {
            this.isOwner = false
          }
        }
      }, 1000)
    })
  },
  destroyed () {
    clearInterval(this.updatingTicker)
    clearInterval(this.updatingBlockData)
    clearInterval(this.updateTableData)
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

