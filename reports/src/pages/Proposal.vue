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
        // {text: 'Clean', key: 'CLEAN', fields:[]}, // 
        {text: 'Universal', key: 'UNIVERSAL', benef:'Beneficiary:',amount:'Amount Wei:',code:'Bytecode:'},
        {text: 'Transfer ownership', key: 'TRANSFER_OWNERSHIP', benef:'New Owner:'},
        {text: 'Set buy limits', key:'SET_BUY_LIMITS', amount:'Min Buy In Wei:',buf:'Max Buy In Wei:'},
        {text: 'Set sell limits', key:'SET_SELL_LIMITS', amount:'Min Sell In Wei:',buf:'Max Sell In Wei:'},
        {text: 'Cancel buy order', key:'CANCEL_BUY_ORDER', amount:'Order ID:'},
        {text: 'cancel sell order', key: 'CANCEL_SELL_ORDER', amount:'Order ID:'},
        {text: 'Attach token', key: 'ATTACH_TOKEN', benef:'Token Address:'},
        {text: 'Set bank address', key:'SET_BANK_ADDRESS', benef:'Bank Address:'},
        {text: 'Set relevance period', key: 'RELEVANCE_PERIOD', amount:'Period in seconds:'},
        {text: 'Set queue period', key: 'QUEUE_PERIOD', amount:'Period in seconds:'},
        {text: 'Set fees', key: 'SET_FEES', amount:'Buy fee:', buf: 'Sell fee:'},
        {text: 'Add oracle', key: 'ADD_ORACLE', benef:'Oracle Address:'},
        {text: 'Disable oracle', key: 'DISABLE_ORACLE', benef:'Oracle Address:'},
        {text: 'Enable oracle', key: 'ENABLE_ORACLE', benef:'Oracle Address:'},
        {text: 'Delete oracle', key: 'DELETE_ORACLE', benef:'Oracle Address:'},
        {text: 'Set scheduler', key: 'SET_SCHEDULER', benef:'Scheduler Address:'},
        {text: 'Winthdraw balance', key: 'WITHDRAW_BALANCE'}
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

          this.currentProposal = this.typeProposals[proposal[struct.type]]
          console.log("current", this.currentProposal)

          this.proposalData.push({name: 'Type:', value: TypeProposal[proposal[struct.type]]})
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
    DaoProposal,
    BRadioButton
  }
}
</script>