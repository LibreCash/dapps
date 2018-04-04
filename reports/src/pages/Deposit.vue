<template>
  <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">Deposit</h2>
      </div>
      <br>
      <div class="table-padding">
        <button class="button is-primary" @click="createPlan()" v-if="owner">Create Plan</button>
        <router-link :to="{ path: '/deposit/new_deposit' }" class="button is-primary">New Deposit</router-link>
      </div>
    </section>
  </div>
</template>



<script>
export default {
  data () {
    return {
      isLoading: false,
      owner: true
    }
  },
  methods: {
    async createPlan() {
      try {
        let txHash = await this.$libre.deposit.createPlan(1,1,1);
        if (await this.$eth.isSuccess(txHash)) {
          this.$snackbar.open('New Plan created!');
        } else {
          this.$snackbar.open('Transaction fail!');
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$snackbar.open(msg);
      }
    }
  },

  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      await this.$libre.loadPlans();
      this.owner = window.web3.eth.defaultAccount == await this.$libre.deposit.owner();
    } catch (err) {
      console.log(err)
    }
  }
}
</script>