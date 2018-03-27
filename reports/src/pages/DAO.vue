
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
import Config from '@/config'
import DaoTable from '@/components/DaoTable'

export default {
  data () {
    return {
      daoAddress: Config.dao.address,
      reportText: '',
      //owner: false,
      reportNumber: 0,
      searchData: [],
      isLoading: false,
      defaultAddress: window.web3.eth.defaultAccount,
      tokensCount: ''
    }
  },
  methods: {

    async addProposal (index) {
      console.log(this.$libre.proposals[index]);
      var 
        proposal = this.$libre.proposals[index].proposal,
        vote = {
          yea: this.$libre.proposals[index].vote[this.$libre.voteStruct.yea],
          nay: this.$libre.proposals[index].vote[this.$libre.voteStruct.nay],
          voted: this.$libre.proposals[index].vote[this.$libre.voteStruct.voted],
          deadline: this.$libre.proposals[index].vote[this.$libre.voteStruct.deadline]
        }

      if (+proposal[this.$libre.proposalStruct.type] !== 0 /* CLEAN */)
      {
        if (this.searchData.length == 10) this.isLoading = false
        this.searchData.push({
            id: index,
            type: this.$libre.typeProposals[proposal[this.$libre.proposalStruct.type]].text,
            recipient: proposal[this.$libre.proposalStruct.recipient] === '0x0000000000000000000000000000000000000000' ? '-' : proposal[this.$libre.proposalStruct.recipient],
            amount: +proposal[this.$libre.proposalStruct.amount],
            buffer: +proposal[this.$libre.proposalStruct.buffer],
            bytecode: proposal[this.$libre.proposalStruct.bytecode],
            votingData: vote,
            yea: vote.yea / 10 ** 18,
            nay: vote.nay / 10 ** 18,
            deadlineUnix: vote.deadline,
            deadline: new Date(vote.deadline * 1000).toLocaleString(),
            description: proposal[this.$libre.proposalStruct.description],
            loading: false,
            updateTimer: null
        })
      }
    },

    async loadProposals () {

      this.searchData = []
      this.isLoading = true
      
      await this.$libre.updateProposals(this.addProposal);
      if (this.searchData.length == 0)
        this.$libre.proposals.reverse().forEach((proposal,i) => this.addProposal(i))

      this.searchData.forEach(element => {
        element.updateTimer = setInterval(async () => {
          // we can check type of proposal, but we won't
          // the changing of the type can be seen in another timer by detecting change of numProposals
          var vote = await this.$libre.dao.getVotingData(element.id)
          element.yea = vote.yea / 10 ** 18
          element.nay = vote.nay / 10 ** 18
          element.votingData = vote
        }, 60 * 1000 + Math.random() * 5000)
      });

      this.isLoading = false
    },

    async getTokensCount () {
      await this.$libre.promiseLibre;

      this.tokensCount = +await this.$libre.libre.balanceOf(this.defaultAddress) / 10 ** 18;
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