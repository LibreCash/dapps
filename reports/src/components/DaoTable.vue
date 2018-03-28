<template>
  <div id="DaoTable" class="table-padding">
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
          <span v-if="props.row.deadlineUnix <= curBlockchainTime">
            outdated
          </span>
        </b-table-column>
        <b-table-column label='Actions' centered>
          <router-link :to="{name: 'DAO Proposal', params: { id: props.row.id }}" tag="button"><i class="mdi mdi-account-card-details"></i></router-link>
          <span v-if="!props.row.votingData.voted && (props.row.deadlineUnix > curBlockchainTime) && !props.row.loading && (props.row.tokensCount > 0)">
            <button v-on:click="vote(props.row, true)"><i class="mdi mdi-check"></i></button>
            <button v-on:click="vote(props.row, false)"><i class="mdi mdi-close"></i></button>
          </span>
          <span v-else-if="props.row.deadlineUnix <= curBlockchainTime">
            <button v-on:click="execute(props.row)"><i class="mdi mdi-console"></i></button>
          </span>
          <span v-else-if="props.row.votingData.voted">
            voted
          </span>
          <span v-else-if="!(props.row.tokensCount > 0)" style="white-space: nowrap">
            no tokens
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
    async vote (row, support) {
      let 
        id = row.id,
        votingData = row.votingData

      row.loading = true
      try {
        let 
          txHash = await this.$libre.dao.vote(id, support),
          message = (await this.$eth.isSuccess(txHash)) ? 'vote tx ok' : 'vote tx failed'
        alert(message)
      }catch(e) {
        alert(this.$eth.getErrorMsg(e)) 
      }
      
      row.loading = false

      try {
        let voteData =  await this.$libre.getVotingData(row.id);
        row = {
          yea: +voteData.yea / 10 ** 18,
          nay: +voteData.nay / 10 ** 18,
          votingData: voteData // Check that we needed it
        }
      } catch(e) {
        alert(this.$eth.getErrorMsg(e))
      }
      row.loading = false
    
    },
    async block (row) {
      row.loading = true

      try {
      let 
        txHash = await this.$libre.dao.blockingProposal(row.id)
        message = (await this.$eth.isSuccess(txHash)) ? 'block tx ok' : 'block tx failed'
        alert(message);
      }catch(e) {
        alert(this.$eth.getErrorMsg(e))
      }
      row.loading = false
    },

    async execute(row) {
      row.loading = true
      
      let 
        id = row.id
      
      try {
        let txHash = await this.$libre.dao.executeProposal(id)
        message = (await this.$eth.isSuccess(txHash)) ? 'Execute proposal successful' : 'Execute proposal failed'
        alert(message)
      } catch(e) {
        alert(this.$eth.getErrorMsg(e))
      }
      row.loading = false
      
    },
    async updateBlockTime() {
      this.curBlockchainTime = +(await this.$eth.getLatestBlockTime())
    },

    startUpdatingTime() {
      this.curBlockchainTime = 0
      this.updatingTicker = setInterval(() => {
        this.curBlockchainTime++
      }, 1000)
      this.updatingBlockData = setInterval(() => {
        this.updateBlockTime()
      }, 10 * 60 * 1000 /* 10 minutes */)
      this.updateBlockTime()
      this.numProposals = -1
      this.updateTableData = setInterval(async () => {
        var numProposals = +(await this.$libre.dao.numProposals())
        if (numProposals !== this.numProposals && this.numProposals !== -1) {
          this.needUpdate = true
          console.log('you need update')
          clearInterval(this.updateTableData)
        }
        if (this.numProposals === -1) {
          this.numProposals = numProposals
        }
      }, 60 * 1000)
    }
  },
  created () {
    this.startUpdatingTime()
    this.$libre.dao.owner().then((owner) => {
      this.contractOwner = owner
      var loginChecker = setInterval(() => {
        if (this.$eth.yourAccount != null) {
          clearInterval(loginChecker)
          if (owner === this.$eth.yourAccount) {
            this.isOwner = true
          } else {
            this.isOwner = false
          }
        }
      }, 1000)
    })
  },
  destroyed () {
    let intervals = [
      this.updatingTicker,
      this.updatingBlockData,
      this.updateTableData
    ]

    intervals.forEach((interval) => clearInterval(interval))
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
