<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO Proposal</h2>
      </div>
      <br>
      <div>Address: {{ defaultAddress }}</div>
      <div>Tokens count: {{ tokensCount }} LBRS</div>
      <br>
      <dao-table :tableData='searchData'></dao-table>
      <router-link :to="{ path: '/dao/new_proposal' }">New Proposal</router-link>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
    </section>
    </div>
</template>



<script>
import DaoTable from '@/components/DaoTable'
import BRadioButton from 'buefy/src/components/radio/RadioButton'
// replace it to dao data
export default {
  data () {
    return {
      daoAddress: this.$eth.daoAddress,
      reportText: '',
      owner: false,
      reportNumber: 0,
      searchData: [],
      isLoading: false,
      defaultAddress: window.web3.eth.defaultAccount,
      tokensCount: ''
    }
  },
  methods: {
    async newReport () {
      try {
        await this.$eth.addNewReport(this.reportText)
      } catch (err) {
        console.log(err)
      }
    },
    async loadProposals () {
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
    
      this.searchData = []
      this.isLoading = true
      try {
        let j = await this.$eth.proposalCounter()
        for (let i = j - 1; i > 0; --i) {
          var 
            proposal = await this.$eth.getProposal(i),
            vote = await this.$eth.getVotingData(i)
          this.searchData.push({
              id: i,
              type: TypeProposal[proposal[struct.type]],
              recipient: proposal[struct.recipient] === '0x0000000000000000000000000000000000000000' ? '-' : proposal[struct.recipient],
              amount: +proposal[struct.amount],
              buffer: +proposal[struct.buffer],
              bytecode: proposal[struct.bytecode],
              votingData: vote,
              yea: vote.yea / 10**18,
              nay: vote.nay / 10**18,
              deadlineUnix: vote.deadline,
              deadline: new Date(vote.deadline * 1000).toLocaleString(),
              description: proposal[struct.description],
              loading: false
          })
        }
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },
    async loadETH () {
      this.isLoading = true
      try {
        await this.loadReport()
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },
    async mayVote () {
      this.owner = await this.$eth.mayVote()
    },

    async getTokensCount() {
      await this.$eth.promiseLibre;

      this.tokensCount = +await this.$eth.libre.balanceOf(this.defaultAddress) / 10 **18;
    }
  },
  created () {
    try {
      this.loadProposals()
      this.getTokensCount()
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    DaoTable,
    BRadioButton
  }
}
</script>