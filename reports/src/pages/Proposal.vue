<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO Proposal {{ $route.params.id }}</h2>
      </div>
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
        0: 'CLEAN',
        1: 'UNIVERSAL',
        2: 'TRANSFER_OWNERSHIP',
        3: 'SET_BUY_LIMITS',
        4: 'SET_SELL_LIMITS',
        5: 'CANCEL_BUY_ORDER',
        6: 'CANCEL_SELL_ORDE',
        7: 'ATTACH_TOKEN',
        8: 'SET_BANK_ADDRESS',
        9: 'RELEVANCE_PERIOD',
        10: 'QUEUE_PERIOD',
        11: 'SET_FEES',
        12: 'ADD_ORACLE',
        13: 'DISABLE_ORACLE',
        14: 'ENABLE_ORACLE',
        15: 'DELETE_ORACLE',
        16: 'SET_SCHEDULER',
        17: 'WITHDRAW_BALANCE'
     }
    
      this.proposalData = []
      this.isLoading = true
      try {
          var 
            proposal = await this.$eth.getProposal(this.$route.params.id),
            vote = await this.$eth.getVotingData(this.$route.params.id)
            console.log("PROP",proposal)
            console.log("VOTE",vote)
          this.proposalData.push({
              type: TypeProposal[proposal[struct.type]],
              recipient: proposal[struct.recipient] === '0x0000000000000000000000000000000000000000' ? '-' : proposal[struct.recipient],
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