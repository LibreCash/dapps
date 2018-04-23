<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO Proposal #{{ $route.params.id }}</h2>
      </div>
      <br>
      <div class="table-padding">
        <div>Token count: {{ tokensCount }} LBRS</div>
        <div>Min token count to create/vote: {{ $libre.proposalParams.minBalance / 10 ** 18 }} LBRS</div>
        <div>Min vote count to execute proposal: {{ $libre.proposalParams.quorum / 10 ** 18 }} LBRS</div>
        <div>Min deadline period in seconds: {{ $libre.proposalParams.minTime }}</div>
        <div>Current time: {{ new Date(curBlockchainTime * 1000).toLocaleString() }}</div>

        <router-link :to="{ path: '/dao' }" class="button">
          <b-icon icon="keyboard-return" size="is-small"></b-icon>
          <span>Back</span>
        </router-link>
        <b-table :data="isEmpty ? [] : proposalData"
          :bordered="isBordered"
          :striped="isStriped"
          :narrowed="isNarrowed"
          :loading="isLoading"
          :mobile-cards="hasMobileCards">
          <template slot-scope="props">
            <b-table-column label='Name'>
              <strong>{{ props.row.name }}</strong>
            </b-table-column>
            <b-table-column label='Status' centered>
              {{ props.row.value }}
            </b-table-column>
          </template>
        </b-table>
        <div class="columns is-centered">
          <div class="column is-narrow">
            <b-tooltip label="Vote Yea" type="is-dark" position="is-bottom">
              <button class="button is-success is-medium" v-on:click="vote(true)" :disabled="!enableVote"><i class="mdi mdi-check"></i></button>
            </b-tooltip>
          </div>
          <div class="column is-narrow">
            <b-tooltip label="Vote Nay" type="is-dark" position="is-bottom">
              <button class="button is-danger is-medium" v-on:click="vote(false)" :disabled="!enableVote"><i class="mdi mdi-close"></i></button>
            </b-tooltip>
          </div>
          <div class="column is-narrow">
            <b-tooltip label="Execute" type="is-dark" position="is-bottom">
              <button class="button is-warning is-medium" v-on:click="execute()" :disabled="!enableExecute"><i class="mdi mdi-console"></i></button>
            </b-tooltip>
          </div>
          <div class="column is-narrow">
            <b-tooltip label="Block" type="is-dark" position="is-bottom">
              <button class="button is-danger is-medium" v-on:click="block()" :disabled="!enableBlock"><i class="mdi mdi-block-helper"></i></button>
            </b-tooltip>
          </div>
        </div>
        
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
      proposalId: this.$route.params.id,
      reportText: '',
      owner: false,
      proposalData: [],
      isEmpty: false,
      isBordered: false,
      isStriped: true,
      isNarrowed: false,
      isLoading: false,
      hasMobileCards: true,
      isPaginated: true,
      isPaginationSimple: false,
      currentPage: 1,
      perPage: 5,
      typeProposals: this.$libre.typeProposals,
      currentProposal: '',
      enableVote: true,
      enableExecute: true,
      enableBlock: true,
      tokensCount: '',
      curBlockchainTime: 0
    }
  },
  methods: {
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
    },

    clearTimers() {
      this.tableData.forEach(element => {
        clearInterval(element.updateTimer)
      })
      let intervals = [
        this.updatingTicker,
        this.updatingBlockData,
      ]
      intervals.forEach((interval) => clearInterval(interval))
    },

    async getTokensCount () {
      await this.$libre.promiseLibre;
      this.tokensCount = +await this.$libre.liberty.balanceOf(this.defaultAddress) / 10 ** this.$libre.consts.DECIMALS;
    },

    async loadProposal () {
      const 
        struct = this.$libre.proposalStruct
    
      this.proposalData = []
      this.isLoading = true

      try {
          let 
            proposal = await this.$libre.updateProposal(this.$route.params.id),
            vote = proposal.vote;

          this.currentProposal = this.typeProposals[proposal.type]
          
          this.proposalData.push({
            name: 'Type:',
            value: this.currentProposal.text
          })

          this.proposalData.push({
            name: 'Status:',
            value: this.$libre.proposalStatuses[+proposal.status].text
          })

          // Refactor it 
          if (this.currentProposal["benef"])
            this.proposalData.push({
              name: this.currentProposal["benef"], 
              value: this.$eth.isZeroAddress(proposal.recipient) ? '-' : proposal.recipient
            })
          
          if (this.currentProposal["amount"])
            this.proposalData.push({
              name: this.currentProposal["amount"], 
              value: `${proposal.amount}`
            })
          
          if (this.currentProposal["buf"])
            this.proposalData.push({
              name: this.currentProposal["buf"], 
              value: `${proposal.buffer}`
            })

          if (this.currentProposal["code"])
            this.proposalData.push({
              name: this.currentProposal["code"], 
              value: proposal.bytecode
            })
          
          this.proposalData.push(
            {name: 'Voting:', value: `${vote.yea}/${vote.nay}`},
            {name: 'Deadline:', value: new Date(vote.deadline * 1000).toLocaleString()},
            {name: 'Now:', data: 'now', rawValue: 0, value: 0},
            {name: 'Description:', value: proposal.description}
          )
          this.updateBlockTime();

          this.isActive = +proposal.status === this.$libre.proposalStatuses[0].number;
          this.enableVote = this.$eth.toTimestamp(vote.deadline) > this.getNow() &&
                          !vote.voted ||
                          this.tokensCount >= this.$libre.proposalParams.minBalance &&
                          this.isActive;
          this.contractOwner = await this.$libre.dao.owner();
          this.isOwner = this.contractOwner === this.$eth.yourAccount;
          this.enableExecute = this.$eth.toTimestamp(vote.deadline) > this.getNow() &&
                              this.isActive &&
                              (vote.yea > vote.nay) &&
                              (vote.yea + vote.nay >= this.$libre.proposalParams.quorum / 10 ** 18)
          this.enableBlock = this.isOwner && this.isActive;
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },

    async vote (support) {
      try {
        let 
          txHash = await this.$libre.dao.vote(this.proposalId, support);
        this.isLoading = true;
        let
          result = await this.$eth.isSuccess(txHash) ? 'Success voting transaction' : 'Failed voting transaction'

        alert(result) // Replace it to notify
        await this.$libre.updateProposal(this.proposalId)
        this.loadProposal()
        
      } catch(err) {
        alert(this.$eth.getErrorMsg(err))
        
        this.isLoading = false
      }
    },
    async execute () {
      try {
        let 
          txHash = await this.$libre.dao.executeProposal(this.proposalId);
        this.isLoading = true;
        let
          result = await this.$eth.isSuccess(txHash) ? 'Success execute transaction' : 'Failed execute transaction'

        alert(result) // Replace it to notify
        await this.$libre.updateProposal(this.proposalId)
        this.loadProposal()
        
      } catch(err) {
        alert(this.$eth.getErrorMsg(err))
        
        this.isLoading = false
      }
    },
    async block () {
      try {
        let 
          txHash = await this.$libre.dao.blockingProposal(this.proposalId);
        this.isLoading = true;
        let
          result = await this.$eth.isSuccess(txHash) ? 'Success block transaction' : 'Failed block transaction'

        alert(result) // Replace it to notify
        await this.$libre.updateProposal(this.proposalId)
        this.loadProposal()
        
      } catch(err) {
        alert(this.$eth.getErrorMsg(err))
        
        this.isLoading = false
      }
    },

    getNow() {
      return this.proposalData.find(item => item.data === "now").rawValue;
    },

    clearTimers() {
      let intervals = [
        this.updatingTicker,
        this.updatingBlockData
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
      this.loadProposal();
      this.getTokensCount();

      this.startUpdatingTime();
    } catch (err) {
      console.log(err)
    }
  },
  destroyed () {
    this.clearTimers();
  }
}
</script>

<style>
button.is-success {
  float: right;
}
</style>