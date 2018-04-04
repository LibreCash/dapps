<template>
  <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">Deposit</h2>
      </div>
      <br>
      <div class="table-padding">
        <button class="button is-primary" @click="createPlan()" v-if="owner">Create Plan</button>
        <router-link :to="{ path: '/deposit/new_deposit' }" class="button is-primary">New Deposit</router-link><br><br>
        <h3 class="subtitle has-text-centered">Plans</h3>
        <b-table :data="plansData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="isloadingPlans"
          :mobile-cards="true">
          <template slot-scope="props">
            <b-table-column label='ID'>
              <strong>{{ props.row.id }}</strong>
            </b-table-column>
            <b-table-column label='Percent'>
              <strong>{{ props.row.percent }}</strong>
            </b-table-column>
            <b-table-column label='Period' centered>
              {{ props.row.period }}
            </b-table-column>
            <b-table-column label='Min Amount' centered>
              {{ props.row.minAmount }}
            </b-table-column>
          </template>
        </b-table>
        <br>
        <h3 class="subtitle has-text-centered">My Deposits</h3>
        <b-table :data="myDepositData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="isloadingDeposit"
          :mobile-cards="true">
          <template slot-scope="props">
            <b-table-column label='Time start' centered>
              {{ props.row.timestamp }}
            </b-table-column>
            <b-table-column label='Deadline' centered>
              {{ props.row.deadline }}
            </b-table-column>
            <b-table-column label='Amount' centered>
              {{ props.row.amount }}
            </b-table-column>
            <b-table-column label='Margin' centered>
              {{ props.row.margin }}
            </b-table-column>
          </template>
        </b-table>
      </div>
    </section>
  </div>
</template>



<script>
export default {
  data () {
    return {
      isLoading: false,
      owner: true,
      plansData: [],
      isloadingPlans: true,
      myDepositData: [],
      isloadingDeposit: true
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
    },

    async pushPlans() {
      await this.$libre.loadPlans();
      this.$libre.plans.forEach((plan) => this.plansData.push(plan))
      this.isloadingPlans = false
    },

    async pushMyDeposit() {
      for(let i=0; true;i++) {
        let deposit = this.$libre.getDepositObject(await this.$libre.deposit.myDeposit(i));

        if (deposit.amount == 0)
          break

        this.myDepositData.push(deposit)
      }
      
      this.isloadingDeposit = false
    }
  },

  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.owner = window.web3.eth.defaultAccount == await this.$libre.deposit.owner();
      this.pushPlans();
      this.pushMyDeposit();
    } catch (err) {
      console.log(err)
    }
  }
}
</script>