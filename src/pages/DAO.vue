<template>
  <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO Proposal</h2>
      </div>
      <br>
      <div class="table-padding">
        <div>Address: {{ defaultAddress }}</div>
        <div v-if="tokensCount == 0">You have no tokens to vote</div>
        <div>DAO Contract Address: {{ daoAddress }}</div>
        <div>Liberty Token Address: {{ libertyAddress }}</div>
        <div>Token count: {{ tokensCount }} LBRS</div>
        <div>Min token count to create/vote: {{ $libre.proposalParams.minBalance / 10 ** 18 }} LBRS</div>
        <div>Min vote count to execute proposal: {{ $libre.proposalParams.quorum / 10 ** 18 }} LBRS</div>
        <div>Min deadline period in seconds: {{ $libre.proposalParams.minTime }}</div>
        <div>Current time: {{ new Date(curBlockchainTime * 1000).toLocaleString() }}</div>
        <br>
        <router-link :to="{ path: '/dao/new_proposal' }" class="button is-primary" v-if="tokensCount > $libre.proposalParams.minBalance / 10 ** 18">New Proposal</router-link>
        <br><br>
        <b-field>
          <b-radio-button v-model="filter" native-value="filterALL" type="is-success" @input="loadProposals()">ALL</b-radio-button>
          <b-radio-button v-model="filter" native-value="filterActive" type="is-success" @input="loadProposals()">Active</b-radio-button>
        </b-field>
        <b-message type="is-warning" v-if="needUpdate">
          The table isn't actual. Please update the page
        </b-message>
        <b-table
          :data="tableData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="isLoading"
          :paginated="true"
          :per-page="perPage"
          :current-page.sync="currentPage"
          :pagination-simple="false"
          :mobile-cards="true"
          :responsive="true">
          <template slot-scope="props" v-if="!props.row.tempHide">
            <b-table-column field="report.type" label='Type' centered>
              <p>{{ props.row.loading ? 'loading...' : props.row.type }}</p>
              <p v-if="props.row.status == 'FINISHED'" class="tag is-success is-rounded">
                Finished
              </p>
              <p v-if="props.row.status == 'BLOCKED'" class="tag is-danger is-rounded">
                Blocked
              </p>
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
              <span v-if="props.row.deadlineUnix <= curBlockchainTime" class="tag is-warning is-rounded">
                outdated
              </span>
            </b-table-column>
            <b-table-column label='Actions' centered>
              <!-- details button -->
              <b-tooltip label="Details" type="is-dark" position="is-bottom">
                <router-link class="button" :to="{name: 'DAO Proposal', params: { id: props.row.id }}" tag="button"><i class="mdi mdi-account-card-details"></i></router-link>
              </b-tooltip>
              <!-- vote buttons -->
              <span v-if="!props.row.votingData.voted &&
                          (props.row.deadlineUnix > curBlockchainTime) &&
                          !props.row.loading &&
                          (tokensCount >= $libre.proposalParams.minBalance / Math.pow(10, 18)) &&
                          (props.row.status === $libre.proposalStatuses[0].text)">
                <b-tooltip label="Yea" type="is-dark" position="is-bottom">
                  <button class="button" v-on:click="vote(props.row, true)"><i class="mdi mdi-check"></i></button>
                </b-tooltip>
                <b-tooltip label="Nay" type="is-dark" position="is-bottom">
                  <button class="button" v-on:click="vote(props.row, false)"><i class="mdi mdi-close"></i></button>
                </b-tooltip>
              </span>
              <!-- execute button -->
              <span v-else-if="props.row.deadlineUnix <= curBlockchainTime &&
                              (props.row.status === $libre.proposalStatuses[0].text) &&
                              !props.row.loading &&
                              (props.row.yea > props.row.nay) &&
                              (props.row.yea + props.row.nay >= $libre.proposalParams.quorum / Math.pow(10, 18))">
                <b-tooltip label="Execute" type="is-dark" position="is-bottom">
                  <button class="button" v-on:click="execute(props.row)"><i class="mdi mdi-console"></i></button>
                </b-tooltip>
              </span>
              <span v-else-if="props.row.votingData.voted" class="tag is-success is-rounded">
                voted
              </span>
              <span v-else-if="props.row.loading">
                loading
              </span>
              <!-- block button -->
              <span v-if="isOwner &&
                          (props.row.status === $libre.proposalStatuses[0].text) &&
                          !props.row.loading">
                <b-tooltip label="Block as owner" type="is-dark" position="is-bottom">
                  <button class="button" v-on:click="block(props.row)"><i class="mdi mdi-block-helper"></i></button>
                </b-tooltip>
              </span>
            </b-table-column>
          </template>
        </b-table>
      </div>
    </section>
  </div>
</template>



<script>
import Config from '@/config'

export default {
  data () {
    return {
      daoAddress: '',
      libertyAddress: '',
      tableData: [],
      isLoading: false,
      defaultAddress: '',
      tokensCount: '',
      filter: "filterALL",
      currentPage: 1,
      perPage: 5,
      curBlockchainTime: 0,
      needUpdate: false,
      isOwner: false,
      contractOwner: null
    }
  },
  methods: {
    async addProposal (index) {
      var 
        proposal = this.$libre.proposals[index],
        vote = proposal.vote;

      if (this[this.filter](proposal))
      {
        if (this.tableData.length == this.perPage) this.isLoading = false
        this.tableData.push({
            id: index,
            type: this.$libre.typeProposals[proposal.type].text,
            recipient: this.$eth.isZeroAddress(proposal.recipient) ? '-' : proposal.recipient,
            amount: proposal.amount,
            buffer: proposal.buffer,
            bytecode: proposal.bytecode,
            votingData: vote,
            yea: vote.yea,
            nay: vote.nay,
            deadlineUnix: vote.deadline,
            deadline: new Date(vote.deadline * 1000).toLocaleString(),
            description: proposal.description,
            loading: false,
            updateTimer: null,
            status: this.$libre.proposalStatuses[+proposal.status].text
        })
      }
    },

    filterALL(proposal) {
      return true;
    },

    filterActive(proposal) {
      return proposal.type !== 0;
    },

    async loadProposals () {
      await this.updateBlockTime();

      this.clearTimers();
      this.tableData = []
      this.isLoading = true

      await this.$libre.updateProposals(this.addProposal);
      if (this.tableData.length == 0) {
        for(let i = this.$libre.proposals.length-1; i >=0; i--)
          this.addProposal(i)
      }

      this.tableData.forEach(element => {
        element.updateTimer = setInterval(async () => {
          // we can check type of proposal, but we won't
          // the changing of the type can be seen in another timer by detecting change of numProposals
          
          var vote = (await this.$libre.updateProposal(element.id)).vote;
          element.yea = vote.yea
          element.nay = vote.nay
          element.votingData = vote
        }, 60 * 1000 + Math.random() * 5000)
      });

      this.isLoading = false

      this.startUpdatingTime()
      this.contractOwner = await this.$libre.dao.owner()
      var loginChecker = setInterval(() => {
        if (this.$eth.yourAccount != null) {
          clearInterval(loginChecker)
          if (this.contractOwner === this.$eth.yourAccount) {
            this.isOwner = true
          } else {
            this.isOwner = false
          }
        }
      }, 1000)
    },

    async getTokensCount () {
      await this.$libre.promiseLibre;
      this.tokensCount = +await this.$libre.liberty.balanceOf(this.defaultAddress) / 10 ** this.$libre.consts.DECIMALS;
    },

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

      try {
        let voteData = (await this.$libre.updateProposal(row.id)).vote;
        row.yea = voteData.yea;
        row.nay = voteData.nay;
        row.votingData = voteData;
      } catch(e) {
        alert(this.$eth.getErrorMsg(e))
      }
      row.loading = false
    
    },
    async block (row) {
      row.loading = true

      try {
      let 
        txHash = await this.$libre.dao.blockingProposal(row.id),
        message = (await this.$eth.isSuccess(txHash)) ? 'block tx ok' : 'block tx failed'
        alert(message);
        let proposalStatus = (await this.$libre.updateProposal(row.id)).status;
        row.status = this.$libre.proposalStatuses[proposalStatus].text // it is "Finished" but we shall recheck
      } catch(e) {
        alert(this.$eth.getErrorMsg(e))
      }
      row.loading = false
    },

    async execute(row) {
      row.loading = true
      
      let 
        id = row.id
      
      try {
        let txHash = await this.$libre.dao.executeProposal(id),
            message = (await this.$eth.isSuccess(txHash)) ? 'Execute proposal successful' : 'Execute proposal failed'
        alert(message)
        let proposalStatus = (await this.$libre.updateProposal(row.id)).status;
        row.status = this.$libre.proposalStatuses[proposalStatus].text // it is "Finished" but we shall recheck
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
    },

    clearTimers() {
      this.tableData.forEach(element => {
        clearInterval(element.updateTimer)
      })

      let intervals = [
        this.updatingTicker,
        this.updatingBlockData,
        this.updateTableData
      ]

      intervals.forEach((interval) => clearInterval(interval))
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.daoAddress = Config.dao.address;
      this.defaultAddress = window.web3.eth.defaultAccount;
      this.libertyAddress = this.$libre.libertyAddress;
      this.loadProposals()
      this.getTokensCount()
    } catch (err) {
      console.log(err)
    }
  },
  destroyed () {
    this.clearTimers();
  }
}
</script>