<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO (Draft) Proposal {{ $route.params.id }}</h2>
      </div>
      <br>
      <div class="table-padding">
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
      </div>
      
    </section>
    </div>
</template>

<script>
import BRadioButton from 'buefy/src/components/radio/RadioButton'

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
      typeProposals: [
        {text: 'Finished', key: 'CLEAN', fields:[]},
        {text: 'Custom', key: 'UNIVERSAL', benef:'Beneficiary:',amount:'Amount Wei:',code:'Bytecode:'},
        {text: 'Transfer Ownership', key: 'TRANSFER_OWNERSHIP', benef:'New Owner:'},
        {text: 'Set Buy Limit', key:'SET_BUY_LIMITS', amount:'Min Buy In Wei:',buf:'Max Buy In Wei:'},
        {text: 'Set Sell Limit', key:'SET_SELL_LIMITS', amount:'Min Sell In Wei:',buf:'Max Sell In Wei:'},
        {text: 'Cancel Buy Order', key:'CANCEL_BUY_ORDER', amount:'Order ID:'},
        {text: 'Cancel Sell Order', key: 'CANCEL_SELL_ORDER', amount:'Order ID:'},
        {text: 'New token', key: 'ATTACH_TOKEN', benef:'Token Address:'},
        {text: 'New Bank', key:'SET_BANK_ADDRESS', benef:'Bank Address:'},
        {text: 'New Rate Period', key: 'RELEVANCE_PERIOD', amount:'Period in seconds:'},
        {text: 'New Queue Period', key: 'QUEUE_PERIOD', amount:'Period in seconds:'},
        {text: 'Changer fees', key: 'SET_FEES', amount:'Buy fee:', buf: 'Sell fee:'},
        {text: 'Add Oracle', key: 'ADD_ORACLE', benef:'Oracle Address:'},
        {text: 'Disable Oracle', key: 'DISABLE_ORACLE', benef:'Oracle Address:'},
        {text: 'Enable Oracle', key: 'ENABLE_ORACLE', benef:'Oracle Address:'},
        {text: 'Delete Oracle', key: 'DELETE_ORACLE', benef:'Oracle Address:'},
        {text: 'Set schedule', key: 'SET_SCHEDULER', benef:'Scheduler Address:'},
        {text: 'Withdraw balance', key: 'WITHDRAW_BALANCE'}
      ],
      currentProposal: ''
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
            console.log("PROP", proposal)
            console.log("VOTE", vote)

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
          console.log(vote)
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
    BRadioButton
  }
}
</script>