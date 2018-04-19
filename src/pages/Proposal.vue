<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO Proposal #{{ $route.params.id }}</h2>
      </div>
      <br>
      <div class="table-padding">
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
        <div class="columns">
          <div class="column">
            <div class="columns">
              <div class="column">
                <button class="button is-success is-medium" v-on:click="vote(true)" :disabled="disVote"><i class="mdi mdi-check"></i></button>
              </div>
              <div class="column">
                <button class="button is-danger is-medium" v-on:click="vote(false)" :disabled="disVote"><i class="mdi mdi-close"></i></button>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="columns">
              <div class="column" v-if="executeEnable">
                <button v-bind:class="{'button is-medium is-info':true, 'is-loading':isExecute}" @click="executeProposal()"><i class="mdi mdi-console"></i></button>
              </div>
              <div class="column" v-if="contractOwner">
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
      disVote: false,
      contractOwner: false,
      deadline: '',
      executeEnable: false,
      isExecute: false,
      isBlock: false
    }
  },
  methods: {
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

          this.disVote = (this.$eth.toTimestamp(vote.deadline) <= (Date.now()) || vote.voted) ? true : false
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

    async checkOwner() {
      this.contractOwner = this.$eth.yourAccount === await this.$libre.dao.owner()
    },

    async startTimers() {
      this.executeEnable = this.deadline <= +await this.$eth.getLatestBlockTime();

      this.updatingTicker = setInterval(async () => {
        this.executeEnable = (this.deadline <= +(await this.$eth.getLatestBlockTime()));
        if (this.executeEnable)
          clearInterval(this.updatingTicker)
      }, 1000)
    },

    async executeProposal() {
      this.isExecute = true;

      try {
        let txHash = await this.$libre.dao.executeProposal(this.$route.params.id)

        if (await this.$eth.isSuccess(txHash)) {
          this.$snackbar.open('Proposal execute!');
        } else {
          this.$snackbar.open('Proposal not execute!');
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
          this.$snackbar.open('Proposal blocked!');
        } else {
          this.$snackbar.open('Proposal not blocked!');
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
      this.checkOwner();
      this.loadProposal();
      this.startTimers();
    } catch (err) {
      console.log(err)
    }
  },
  destroyed () {
    clearInterval(this.updatingTicker)
  }
}
</script>

<style>
button.is-success {
  float: right;
}
</style>