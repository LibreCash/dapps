
<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO Proposal</h2>
      </div>
      <br>
      <div class="table-padding">
        <div>Address: {{ defaultAddress }}</div>
        <div>Tokens count: {{ tokensCount }} LBRS</div>
        <br>
        <router-link :to="{ path: '/dao/new_proposal' }" class="button is-primary">New Proposal</router-link>
      </div>
      <br>
      <dao-table :tableData='searchData'></dao-table>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
    </section>
    </div>
</template>



<script>
import DaoTable from '@/components/DaoTable'
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
    async loadProposals () {
      const struct = {
        'type':0,
        'recipient':1,
        'amount':2,
        'buffer':3,
        'bytecode':4,
        'description':5
      }

      this.searchData = []
      this.isLoading = true
      try {
        let j = await this.$eth.proposalCounter()
        let activeProposalShown = 0
        for (let i = j - 1; i > 0; --i) {
          var 
            proposal = await this.$eth.getProposal(i),
            vote = await this.$eth.getVotingData(i)
          if (+proposal[struct.type] !== 0 /* CLEAN */)
          {
            if (++activeProposalShown == 10) this.isLoading = false
            this.searchData.push({
                id: i,
                type: this.$libre.typeProposals[proposal[struct.type]].text,
                recipient: proposal[struct.recipient] === '0x0000000000000000000000000000000000000000' ? '-' : proposal[struct.recipient],
                amount: +proposal[struct.amount],
                buffer: +proposal[struct.buffer],
                bytecode: proposal[struct.bytecode],
                votingData: vote,
                yea: vote.yea / 10 ** 18,
                nay: vote.nay / 10 ** 18,
                deadlineUnix: vote.deadline,
                deadline: new Date(vote.deadline * 1000).toLocaleString(),
                description: proposal[struct.description],
                loading: false,
                updateTimer: null
            })
          }
        }
      } catch (err) {
        console.log(err)
      }
      this.searchData.forEach(element => {
        element.updateTimer = setInterval(async () => {
          // we can check type of proposal, but we won't
          // the changing of the type can be seen in another timer by detecting change of numProposals
          var vote = await this.$eth.getVotingData(element.id)
          element.yea = vote.yea / 10 ** 18
          element.nay = vote.nay / 10 ** 18
          element.votingData = vote
        }, 60 * 1000 + Math.random() * 5000)
      });

      this.isLoading = false
    },

    async mayVote () {
      this.owner = await this.$eth.mayVote()
    },

    async getTokensCount () {
      await this.$eth.promiseLibre;

      this.tokensCount = +await this.$eth.libre.balanceOf(this.defaultAddress) / 10 ** 18;
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
  destroyed () {
    this.searchData.forEach(element => {
      clearInterval(element.updateTimer)
    })
  },
  components: {
    DaoTable
  }
}
</script>