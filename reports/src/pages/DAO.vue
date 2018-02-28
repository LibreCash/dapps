<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO Proposal</h2>
      </div>
      <proposal-dao :tableData='proposalData'></proposal-dao>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
    </section>
    </div>
</template>



<script>
import ProposalDao from '@/components/ProposalDAO'
export default {
  data () {
    return {
      proposalData: [],
      isLoading: false
    }
  },
  methods: {
    async loadProposals () {
      this.proposalData.push({date: new Date(), state: 'New', type: 'Hello everyone!'})
      this.proposalData.push({date: new Date(), state: 'Old', type: 'Good Bye!'})
    }
  },
  created () {
    try {
      this.loadProposals()
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    ProposalDao
  }
}
</script>