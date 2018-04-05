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
        <b-field horizontal label="Amount, Libre" :type="isValidAmount ? '' : 'is-danger'">
          <b-input v-model="amount"></b-input>
        </b-field>
        <b-table :data="plans" :selected.sync="selectedPlan">
          <template slot-scope="props">
            <b-table-column label='Description' centered>
              {{ props.row.description }}
            </b-table-column>
            <b-table-column label='Annual percent' centered>
              {{ props.row.percent / 100 }} %
            </b-table-column>
            <b-table-column label='Period' centered>
              {{ periodToDaysString(props.row.period) }}
            </b-table-column>
            <b-table-column label='Minimal amount' centered>
              {{ props.row.minAmount / 10 ** 18 }} Libre
            </b-table-column>
          </template>
        </b-table>
        <div v-if="Object.keys(selectedPlan).length !== 0">
          <p>Plan: {{ selectedPlan.description }}</p>
          <p>Annual percent: {{ selectedPlan.percent / 100 }} %</p>
          <p>Period: {{ periodToDaysString(selectedPlan.period) }}</p>
          <p>Minimum deposit: {{ selectedPlan.minAmount / 10 ** 18 }} Libre</p>
          <p v-if="isValidAmount">Margin: {{ margin }} Libre</p>
        </div>


        <b-field>
          <b-message :type="msg.type" style="white-space: pre-wrap;">{{ msg.text }}</b-message>
        </b-field>
        <b-field horizontal>
          <button v-bind:class="{button: true, 'is-primary':true, 'is-loading': isLoading}" @click="createDeposit()" :disabled="!isValidAmount">Create Deposit</button>
        </b-field>
      </div>
    </section>
  </div>
</template>

<script>
import Config from '@/config'
import AddressBlock from '@/components/AddressBlock'
export default {
  data () {
    return {
      isLoading: false,
      amount: '',
      plans: this.$libre.plans,
      msg: {},
      isValidAmount: true,
      selectedPlan: {},
      margin: 0
    }
  },
  methods: {
    setMessage(type, message) {
      this.msg = {
        type: `is-${type}`,
        text: message
      }
    },

    periodToDaysString(seconds) {
      var years = Math.floor(seconds / (60 * 60 * 24 * 365));
      seconds -= years * 60 * 60 * 24 * 365;

      var months = Math.floor(seconds / (60 * 60 * 24 * 30));
      seconds -= months * 60 * 60 * 24 * 30;

      var days = Math.floor(seconds / (60 * 60 * 24));
      seconds -= days * 60 * 60 * 24;

      if ((years === 0) && (months === 0) && (days < 3)) {
        var hours   = Math.floor(seconds / (60 * 60));
        seconds -= hours * 60 * 60;

        var minutes = Math.floor(seconds / 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        return `${days}d ${hours}:${minutes}`;
      }
      return `${years}y ${months}m ${days}d`;
    },

    validateData() {
      if (Object.keys(this.selectedPlan).length === 0) {
        this.isValidAmount = false
        return
      }

      this.isValidAmount = (this.selectedPlan.minAmount / 10 ** 18 <= this.amount);
      this.margin = this.amount * this.selectedPlan.percent / 100 * this.selectedPlan.period / 31557600;
    },

    async approveLibre(amount) {
      console.log(amount)
      let allowance = +await this.$libre.token.allowance(this.$eth.yourAccount, Config.deposit.address)
      if (allowance < amount) {
        this.setMessage('warning',`Available amount of deposit:\n1. Authorize the transfer ${this.$libre.toToken(amount)} Libre tokens - wait confirm...`)
        let txHash = await this.$libre.token.approve(Config.loans.address, amount);
        this.setMessage('warning',`Available amount of deposit:\n1. Authorize the transfer ${this.$libre.toToken(amount)} Libre tokens - send to the network...`)
        if (await this.$eth.isSuccess(txHash)) {
          this.setMessage('success',`Available amount of deposit:\n1. Authorize the transfer ${this.$libre.toToken(amount)} Libre tokens - successfully...`)
        } else {
          this.setMessage('danger',`Available amount of deposit:\n1. Authorize the transfer ${this.$libre.toToken(amount)} Libre tokens - fail transaction...`)
          return false
        }
      }
      return true
    },

    async createDeposit() {
      if (Object.keys(this.selectedPlan).length === 0)
        return

      this.isLoading = true;
      try {
        if (!(await this.approveLibre(this.$libre.fromToken(this.amount))))
          return

        this.setMessage('warning',`Create New Deposit - wait confirm...`)
        let txHash = await this.$libre.deposit.createDeposit(this.amount,this.planId);
        this.setMessage('warning',`Create New Deposit - send to the network...`)
        if (await this.$eth.isSuccess(txHash)) {
          this.setMessage('success',`Create New Deposit - successfully...`)
          this.$snackbar.open('New Plan created!');
        } else {
          this.setMessage('danger',`Create New Deposit - fail transaction...`)
          this.$snackbar.open('Transaction fail!');
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$snackbar.open(msg);
        this.msg.text += `\n${msg}`
      }
      this.isLoading = false;
    }
  },

  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      await this.$libre.loadPlans();
    } catch (err) {
      console.log(err)
    }
  },
  watch: {
    amount: function() {this.validateData()},
    selectedPlan: function() {this.validateData()},
    isValidAmount: function() {
      if (!this.isValidAmount) {
        this.msg = {
          type: 'is-danger',
          text: 'Please enter correct information'
        };
      } else if (this.msg.type == "is-danger") {
        this.msg = {};
      }
    }
  },
  components: {
    AddressBlock
  }
}
</script>