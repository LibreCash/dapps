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
        <b-table :data="proposalData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="isLoading"
          :mobile-cards="true">
          <template slot-scope="props">
            <b-table-column label='Name'>
              <strong>{{ props.row.name }}</strong>
            </b-table-column>
            <b-table-column label='Status' centered>
              {{ props.row.value }}
            </b-table-column>
          </template>
        </b-table>
        <div class="columns">
          <div class="column">
            <div class="columns">
              <div class="column">
                <button class="button is-success is-medium" v-on:click="vote(true)" :disabled="!enableVote"><i class="mdi mdi-check"></i></button>
              </div>
              <div class="column">
                <button class="button is-danger is-medium" v-on:click="vote(false)" :disabled="!enableVote"><i class="mdi mdi-close"></i></button>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="columns">
              <div class="column" v-if="executeEnable">
                <button v-bind:class="{'button is-medium is-info':true, 'is-loading':isExecute}" @click="executeProposal()"><i class="mdi mdi-console"></i></button>
              </div>
              <div class="column" v-if="contractOwner && $libre.proposals[proposalId] == $libre.proposalStatus.ACTIVE">
                <button v-bind:class="{'button is-medium is-danger':true, 'is-loading':isBlock}" @click="blocking()"><i class="mdi mdi-block-helper"></i></button>
              </div>
            </div>
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
      isLoading: false,
      isPaginated: true,
      isPaginationSimple: false,
      typeProposals: this.$libre.typeProposals,
      currentProposal: '',
      enableVote: false,
      contractOwner: false,
      deadline: '',
      executeEnable: false,
      isExecute: false,
      isBlock: false,
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

          if (this.currentProposal["code"]) {
            let byteString = this.$libre.bytecodeToString(proposal.recipient, proposal.bytecode);
            this.proposalData.push({
              name: this.currentProposal["code"], 
              value: byteString.length == 0 ? proposal.bytecode : byteString
            })
          }
            
          
          this.deadline = vote.deadline;

          this.proposalData.push(
            {name: 'Voting:', value: `${vote.yea}/${vote.nay}`},
            {name: 'Deadline:', value: new Date(vote.deadline * 1000).toLocaleString()},
            {name: 'Description:', value: proposal.description}
          )
          this.enableVote = this.$eth.toTimestamp(vote.deadline) > this.getNow() &&
                         !vote.voted ||
                          this.tokensCount >= this.$libre.proposalParams.minBalance &&
                          this.isActive;

          this.enableExecute = this.$eth.toTimestamp(vote.deadline) > this.getNow() && 
              this.isActive &&
              (vote.yea > vote.nay) &&
              (vote.yea + vote.nay >= this.$libre.proposalParams.quorum / 10 ** 18)
               this.enableBlock = this.isOwner && this.isActive;

          this.enableBlock = this.isOwner && this.isActive;

          this.startTimers();
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },

    async vote (support) {
      this.isLoading = true;

      try {
        let 
          txHash = await this.$libre.dao.vote(this.proposalId, support);

        this.$snackbar.open(await this.$eth.isSuccess(txHash) ? 'Success voting transaction' : 'Failed voting transaction')
        await this.$libre.updateProposal(this.proposalId)
        this.loadProposal()
        
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$snackbar.open(msg);
      }
    },

    async checkOwner() {
      this.contractOwner = this.$eth.yourAccount === await this.$libre.dao.owner()
    },

    async startTimers() {
      if (this.$libre.proposals[this.proposalId].status != this.$libre.proposalStatus.ACTIVE)
        return

      this.executeEnable = (this.deadline <= +await this.$eth.getLatestBlockTime());

      this.updatingTicker = setInterval(async () => {
        this.executeEnable = (this.deadline <= +(await this.$eth.getLatestBlockTime()));
        if (this.executeEnable || this.$libre.proposals[this.proposalId].status != this.$libre.proposalStatus.ACTIVE)
          clearInterval(this.updatingTicker)
      }, 1000)
    },

    startValidDataTimer () {
      this.validDataTimer = setInterval(() => {
        this.validPeriod = this.isDebatingPeriod();
        this.validData();
      }, 2000)
    },

    endValidDataTimer () {
      clearInterval(this.validDataTimer);
    },

    async executeProposal() {
      this.isExecute = true;

      try {
        let txHash = await this.$libre.dao.executeProposal(this.$route.params.id)

        if (await this.$eth.isSuccess(txHash)) {
          this.$snackbar.open('Proposal executed successfully.');
        } else {
          this.$snackbar.open('Failed on proposal executions');
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$snackbar.open(msg);
      }
      
      this.isExecute = false
    },

    async blocking() {
      this.isBlock = true

      try {
        let txHash = await this.$libre.dao.blockingProposal(this.$route.params.id);

        if (await this.$eth.isSuccess(txHash)) {
          this.$snackbar.open('Proposal blocked.');
        } else {
          this.$snackbar.open('Proposal not blocked.');
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$snackbar.open(msg);
      }

      this.isBlock = false
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.daoAddress = Config.dao.address;
      this.defaultAddress = window.web3.eth.defaultAccount;
      await this.checkOwner();
      await this.loadProposal();
      this.selectedType = this.typeProposals[0];
      this.getTokensCount();
      this.startValidDataTimer();
      this.startUpdatingTime();
    } catch (err) {
      console.log(err)
    }
  },
  clearTimers() {
    let intervals = [
    this.updatingTicker,
    this.updatingBlockData]
    
    intervals.forEach((interval) => clearInterval(interval))
  },

  destroyed () {
    this.endValidDataTimer();
  }
}
</script>

<style>
button.is-success {
  float: right;
}
</style>