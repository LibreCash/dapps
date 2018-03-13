<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO (Draft) Proposal {{ $route.params.id }}</h2>
      </div>
      <br>
      <div class="table-padding">
        <router-link :to="{ path: '/dao' }" class="button">
          <b-icon icon="keyboard-return" size="is-small"></b-icon>&nbsp;&nbsp;&nbsp;&nbsp;Back
        </router-link>
        <span class="icon arrow-left"><i class="arrow-left"></i></span>
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
        <div class="has-text-centered">
          <button class="button is-success is-medium" v-on:click="vote(true)" :disabled="disVote"><i class="mdi mdi-check"></i></button>&nbsp;&nbsp;&nbsp;&nbsp;
          <button class="button is-danger is-medium" v-on:click="vote(false)" :disabled="disVote"><i class="mdi mdi-close"></i></button>
        </div>
        
      </div>
      
    </section>
    </div>
</template>

<script>
export default {
  data () {
    return {
      daoAddress: this.$eth.daoAddress,
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
      const struct = {
        'type':0,
        'recipient':1,
        'amount':2,
        'buffer':3,
        'bytecode':4,
        'description':5
      },
      zeroAddress = '0x0000000000000000000000000000000000000000'
    
      this.proposalData = []
      this.isLoading = true
      try {
          var 
            proposal = await this.$eth.getProposal(this.$route.params.id),
            vote = await this.$eth.getVotingData(this.$route.params.id)

          this.currentProposal = this.typeProposals[proposal[struct.type]]

          this.proposalData.push({name: 'Type:', value: this.currentProposal.text})
          if (this.currentProposal["benef"])
            this.proposalData.push({name: this.currentProposal["benef"], value: proposal[struct.recipient] === zeroAddress ? '-' : proposal[struct.recipient]})
          if (this.currentProposal["amount"])
            this.proposalData.push({name: this.currentProposal["amount"], value: `${proposal[struct.amount]}`})
          if (this.currentProposal["buf"])
            this.proposalData.push({name: this.currentProposal["buf"], value: `${proposal[struct.buffer]}`})
          if (this.currentProposal["code"])
            this.proposalData.push({name: this.currentProposal["code"], value: proposal[struct.bytecode]})
          this.proposalData.push({name: 'Voting:', value: `${vote.yea / 10 ** 18}/${vote.nay / 10 ** 18}`})
          this.proposalData.push({name: 'Deadline:', value: new Date(vote.deadline * 1000).toLocaleString()})
          this.proposalData.push({name: 'Description:', value: proposal[struct.description]})

          this.disVote = (new Date(vote.deadline * 1000) <= (new Date()) || vote.voted) ? true : false
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },

    async vote (support) {
      try {
        let txHash = await this.$eth.daoContract.vote(this.proposalId, support),
          result = await this.$eth.getReceipt(txHash);

        if (+result.status === 1) {
          alert('vote tx ok')
        } else {
          alert('vote tx failed')
        }

        this.$eth.getVotingData(this.proposalId).then((vData) => {
          this.loadProposal()
        })
      } catch(error) {
        if (!error.message.includes('User denied transaction signature')) {
          alert(error.message)
        }
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