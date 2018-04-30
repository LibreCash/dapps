<template>
  <div>
      <div class="table-padding">
        <div class="card">
            <div class="card-content">
                <address-block/>
                <div class="flex">DAO Contract: 
                  <a :href="$libre.addressToLink(daoAddress)" target="_blank" class="is-text-overflow">{{daoAddress}}</a></div>
                <div class="flex">Liberty Token: 
                  <a :href="$libre.addressToLink(libertyAddress)" target="_blank" class="is-text-overflow">{{libertyAddress}}</a>
                </div>
                <div> Current time: {{ new Date(curBlockchainTime * 1000).toLocaleString() }}</div>
                <div>Token count: {{ tokensCount }} LBRS</div>
                <div>Min token count to create/vote: {{ $libre.proposalParams.minBalance / Math.pow(10, 18) }} LBRS</div>
                <div>Min vote count to execute proposal: {{ $libre.proposalParams.quorum / Math.pow(10, 18) }} LBRS</div>
                <div>Min deadline period in seconds: {{ $libre.proposalParams.minTime }}</div>
            </div>
        </div>
        <div class="level"></div>
        <nav class="level">
          <div class="level-item has-text-centered" v-if="tokensCount >= $libre.proposalParams.minBalance / Math.pow(10, 18)">
            <div>
              <p class="heading">Create</p>
              <p>
                <router-link :to="{ path: '/dao/new_proposal' }" class="button is-primary">New Proposal</router-link>
              </p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Proposal type</p>
              <p>
                <b-field>
                  <b-radio-button v-model="filter" native-value="filterALL" type="is-success" @input="loadProposals()">ALL</b-radio-button>
                  <b-radio-button v-model="filter" native-value="filterActive" type="is-success" @input="loadProposals()">Active</b-radio-button>
                </b-field>
              </p>
            </div>
          </div>
        </nav>
        <div class="level"></div>
        <b-table
          class="centered"
          :data="tableData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="isLoading"
          :paginated="perPage < tableData.length"
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
              <a :href="$libre.addressToLink(props.row.recipient)" target="_blank">address</a>
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
              <p>{{ props.row.deadline }}</p>
              <p v-if="props.row.deadlineUnix <= curBlockchainTime" class="tag is-warning is-rounded">
                outdated
              </p>
            </b-table-column>
            <b-table-column label='Actions' centered>
              <!-- details button -->
              <b-tooltip label="Details" type="is-dark" position="is-bottom">
                <router-link :to="{name: 'DAO Proposal Info', params: { id: props.row.id }}" tag="button" class="button"><i class="fas fa-id-card"></i></router-link>
              </b-tooltip>
              <!-- vote buttons -->
              <span v-if="!props.row.votingData.voted &&
                          (props.row.deadlineUnix > curBlockchainTime) &&
                          !props.row.loading &&
                          (tokensCount >= $libre.proposalParams.minBalance / Math.pow(10, 18)) &&
                          (props.row.status === $libre.proposalStatuses[0].text)">
                <b-tooltip label="Yea" type="is-dark" position="is-bottom">
                  <button class="button" v-on:click="vote(props.row, true)"><i class="fas fa-thumbs-up"></i></button>
                </b-tooltip>
                <b-tooltip label="Nay" type="is-dark" position="is-bottom">
                  <button class="button" v-on:click="vote(props.row, false)"><i class="fas fa-thumbs-down"></i></button>
                </b-tooltip>
              </span>
              <!-- execute button -->
              <span v-else-if="props.row.deadlineUnix <= curBlockchainTime &&
                              (props.row.status === $libre.proposalStatuses[0].text) &&
                              !props.row.loading &&
                              (props.row.yea > props.row.nay) &&
                              (props.row.yea + props.row.nay >= $libre.proposalParams.quorum / Math.pow(10, 18))">
                <b-tooltip label="Execute" type="is-dark" position="is-bottom">
                  <button class="button" v-on:click="execute(props.row)"><i class="fas fa-play"></i></button>
                </b-tooltip>
              </span>
              <span v-else-if="props.row.loading">
                loading
              </span>
              <!-- block button -->
              <span v-if="isOwner &&
                          (props.row.status === $libre.proposalStatuses[0].text) &&
                          !props.row.loading">
                <b-tooltip label="Block as owner" type="is-dark" position="is-bottom">
                  <button class="button" v-on:click="block(props.row)"><i class="fas fa-ban"></i></button>
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
import AddressBlock from '@/components/AddressBlock'

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
      isOwner: false,
      contractOwner: null
    }
  },
  methods: {
    async addProposal (index) {
      var proposal = this.$libre.proposals[index];
      var vote = proposal.vote;

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
      return proposal.status == 0;
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
      var loginChecker = setInterval(() => {
        if (this.$eth.yourAccount != null) {
          clearInterval(loginChecker)
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
        this.$libre.notify(message)
      }catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg,'is-danger');
      }

      try {
        let voteData = (await this.$libre.updateProposal(row.id)).vote;
        row.yea = voteData.yea;
        row.nay = voteData.nay;
        row.votingData = voteData;
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg,'is-danger');
      }
      row.loading = false
    
    },
    async block (row) {
      row.loading = true

      try {
      let 
        txHash = await this.$libre.dao.blockingProposal(row.id),
        message = (await this.$eth.isSuccess(txHash)) ? 'block tx ok' : 'block tx failed'
        this.$libre.notify(message);
        let proposalStatus = (await this.$libre.updateProposal(row.id)).status;
        row.status = this.$libre.proposalStatuses[proposalStatus].text // it is "Finished" but we shall recheck
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg,'is-danger');
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
        this.$libre.notify(message)
        let proposalStatus = (await this.$libre.updateProposal(row.id)).status;
        row.status = this.$libre.proposalStatuses[proposalStatus].text // it is "Finished" but we shall recheck
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg,'is-danger');
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
        var numProposals = +(await this.$libre.dao.numProposals());
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
      this.daoAddress = Config.dao.address[this.$eth.network];
      this.defaultAddress = window.web3.eth.defaultAccount;
      this.libertyAddress = this.$libre.libertyAddress;
      this.contractOwner = await this.$libre.dao.owner();
      this.isOwner = (this.contractOwner === this.$eth.yourAccount);

      this.loadProposals();
      this.getTokensCount();
    } catch (err) {
      console.log(err)
    }
  },
  destroyed () {
    this.clearTimers();
  },
  components: {
    AddressBlock
  }
}
</script>