<template>
  <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">New Deposit</h2>
      </div>
      <br>
      <div class="table-padding">
        <button @click="$router.go(-1)" :to="{ path: '/loans' }" class="button">
          <b-icon icon="keyboard-return" size="is-small"></b-icon>
          <span>Back</span>
        </button><br><br>
        <address-block></address-block><br>
        <b-field horizontal label="Amount">
          <b-input type="number" v-model="amount"></b-input>
        </b-field>
        <b-field horizontal label="PlanId">
          <b-input type="number" v-model="planId"></b-input>
        </b-field>
        <b-field horizontal>
          <button v-bind:class="{button:true, 'is-primary':true, 'is-loading': isLoading}" @click="createDeposit()">Create Deposit</button>
        </b-field>
      </div>
    </section>
  </div>
</template>



<script>
import AddressBlock from '@/components/AddressBlock'
export default {
  data () {
    return {
      isLoading: false,
      amount: '',
      planId: ''
    }
  },
  methods: {
    async createDeposit() {
      this.isLoading = true;
      await this.$libre.deposit.createDeposit(this.amount,this.planId);
      this.isLoading = false;
    }
  },

  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    AddressBlock
  }
}
</script>