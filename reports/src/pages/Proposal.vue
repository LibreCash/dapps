<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO (Draft) Proposal {{ $route.params.id }}</h2>
      </div>
      <br>
      <dao-proposal :tableData='proposalData'></dao-proposal>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
    </section>
    </div>
</template>

<script>
import DaoProposal from '@/components/DAOProposal'
import BRadioButton from 'buefy/src/components/radio/RadioButton'

export default {
  data () {
    return {
      daoAddress: this.$eth.daoAddress,
      proposalId: this.$route.params.id,
      reportText: '',
      owner: false,
      proposalData: [],
      isLoading: false
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
      }
      const TypeProposal = {
        0: 'Finished',
        1: 'Custom',
        2: 'Transfer Ownership',
        3: 'Set Buy Limit',
        4: 'Set Sell Limit',
        5: 'Cancel Buy Order',
        6: 'Cancel Sell Order',
        7: 'New token',
        8: 'New Bank',
        9: 'New Rate Period',
        10: 'New Queue Period',
        11: 'Changer fees',
        12: 'Add oracle',
        13: 'Disable oracle',
        14: 'Enable Oracle',
        15: 'Delete Oracle',
        16: 'Set schedule',
        17: 'Withdraw balance'
      }
      const zeroAddress = '0x0000000000000000000000000000000000000000'
    
      this.proposalData = []
      this.isLoading = true
      try {
          var 
            proposal = await this.$eth.getProposal(this.$route.params.id),
            vote = await this.$eth.getVotingData(this.$route.params.id)
            console.log("PROP", proposal)
            console.log("VOTE", vote)
          this.proposalData.push({
              type: TypeProposal[proposal[struct.type]],
              recipient: proposal[struct.recipient] === zeroAddress ? '-' : proposal[struct.recipient],
              amount: proposal[struct.amount],
              buffer: proposal[struct.buffer],
              bytecode: proposal[struct.bytecode],
              votingData: vote,
              deadline: new Date(vote.deadline * 1000).toLocaleString(),
              description: proposal[struct.description]
          })
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
      

    },
    async mayVote () {
      this.owner = await this.$eth.mayVote()
    }
  },
  created () {
    try {
      this.loadProposal()
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    DaoProposal,
    BRadioButton
  }
}
</script>