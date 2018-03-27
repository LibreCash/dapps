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
            <button class="button is-success is-medium" v-on:click="vote(true)" :disabled="disVote"><i class="mdi mdi-check"></i></button>
          </div>
          <div class="column">
            <button class="button is-danger is-medium" v-on:click="vote(false)" :disabled="disVote"><i class="mdi mdi-close"></i></button>
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
      daoAddress: Config.dao.address,
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
      disVote: false
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
            proposal = await this.$libre.getProposal(this.$route.params.id),
            vote = await this.$libre.getVotingData(this.$route.params.id),
            zeroAddress = '0x0000000000000000000000000000000000000000'

          this.currentProposal = this.typeProposals[proposal[struct.type]]
          
          this.proposalData.push({name: 'Type:', value: this.currentProposal.text})

          // Refactor it 
          if (this.currentProposal["benef"])
            this.proposalData.push({
              name: this.currentProposal["benef"], 
              value: proposal[struct.recipient] === zeroAddress ? '-' : proposal[struct.recipient]
            })
          
          if (this.currentProposal["amount"])
            this.proposalData.push({
              name: this.currentProposal["amount"], 
              value: `${proposal[struct.amount]}`
            })
          
          if (this.currentProposal["buf"])
            this.proposalData.push({
              name: this.currentProposal["buf"], 
              value: `${proposal[struct.buffer]}`
            })

          if (this.currentProposal["code"])
            this.proposalData.push({
              name: this.currentProposal["code"], 
              value: proposal[struct.bytecode]
            })
          
          this.proposalData.push(
            {name: 'Voting:', value: `${vote.yea / 10 ** 18}/${vote.nay / 10 ** 18}`},
            {name: 'Deadline:', value: new Date(vote.deadline * 1000).toLocaleString()},
            {name: 'Description:', value: proposal[struct.description]}
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
          txHash = await this.$libre.dao.vote(this.proposalId, support),
          result = this.$eth.isSucces(txHash) ? 'Success voting transaction' : 'Failed voting transaction'

        alert(result) // Replace it to notify
        this.$libre.getVotingData(this.proposalId).then((vData) => this.loadProposal())
        
      } catch(error) {
        alert(this.$eth.getErrorMsg(e))
        
        row.loading = false
      }
    }
  },
  created () {
    try {
      this.loadProposal()
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style>
button.is-success {
  float: right;
}
</style>