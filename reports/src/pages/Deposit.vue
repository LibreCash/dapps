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
        <h3 class="subtitle has-text-centered" v-if="myDepositData.length > 0">My Deposits</h3>
        <b-table :data="myDepositData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="isloadingDeposit"
          :mobile-cards="true"
          :selected.sync="selected">
          <template slot-scope="props">
            <b-table-column label='ID' centered>
              {{ props.row.id }}
            </b-table-column>
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
        <button v-bind:class="{'button field is-danger':true, 'is-loading':isClaimLoading}" @click="claimDeposit(selected)"
            :disabled="!selected" v-if="myDepositData.length > 0">
            <span>Claim Deposit</span>
        </button>
      </div>
      <br><br>
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
      isloadingDeposit: true,
      selected: null,
      isClaimLoading: false
    }
  },
  methods: {
    async createPlan() {
      try {
        let txHash = await this.$libre.deposit.createPlan(1,2,3);
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

    async claimDeposit(selectObject) {
      this.selected = null
      this.isClaimLoading = true
      try {
        let txHash = await this.$libre.deposit.claimDeposit(selectObject.id);
        if (await this.$eth.isSuccess(txHash)) {
          this.$snackbar.open('Deposit returned!');
        } else {
          this.$snackbar.open('Transaction fail!');
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$snackbar.open(msg);
      }
      this.isClaimLoading = false
    },

    async pushPlans() {
      await this.$libre.loadPlans();
      this.$libre.plans.forEach((plan) => this.plansData.push(plan))
      this.isloadingPlans = false
    },

    async pushMyDeposit() {
      let count = +await this.$libre.deposit.myDepositCount();
      for(let i=0; i < count;i++) {
        let deposit = this.$libre.getDepositObject(await this.$libre.deposit.deposits(window.web3.eth.defaultAccount,i));

        this.myDepositData.push({
          id: i,
          timestamp: new Date(deposit.timestamp * 1000).toLocaleString(),
          deadline: new Date(deposit.deadline * 1000).toLocaleString(),
          amount: this.$libre.toToken(deposit.amount),
          margin: this.$libre.toToken(deposit.margin)
        })
      }
      
      this.isloadingDeposit = false
    },
    async checkOwner() {
      this.owner = window.web3.eth.defaultAccount == await this.$libre.deposit.owner();
    }
  },

  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.checkOwner();
      this.pushPlans();
      this.pushMyDeposit();
    } catch (err) {
      console.log(err)
    }
  }
}
</script>