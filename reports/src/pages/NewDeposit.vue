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
        <b-field horizontal label="Amount" :type="isValidAmount ? '' : 'is-danger'">
          <b-input v-model="amount"></b-input>
        </b-field>
        <b-field horizontal label="Plan" >
          <b-select placeholder="Select plan" v-model="selectId">
              <option v-for="plan in plans" v-bind:value="plan.id">
                Percent: {{ plan.percent }}, Period: {{plan.period}}, MinAmount: {{ plan.minAmount}} 
              </option>
          </b-select>
        </b-field>
        <b-field>
          <b-message :type="msg.type" style="white-space: pre-wrap;">{{ msg.text }}</b-message>
        </b-field>
        <b-field horizontal>
          <button v-bind:class="{button:true, 'is-primary':true, 'is-loading': isLoading}" @click="createDeposit()" :disabled="!isValidAmount">Create Deposit</button>
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
      selectId: '',
      plans: this.$libre.plans,
      msg: {
        type: 'is-danger',
        text: 'Please enter correct information'
      },
      isValidAmount: true
    }
  },
  methods: {
    setMessage(type, message) {
      this.msg = {
        type: `is-${type}`,
        text: message
      }
    },

    validateData() {
      if (this.selectId === '') {
        this.isValidAmount = false
        return
      }

      let plan = this.$libre.plans[this.selectId];

      this.isValidAmount = (plan.minAmount <= this.amount) ? true : false
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
      console.log(this.selectId)
      if (this.selectId === '')
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
    selectId: function() {this.validateData()}
  },
  components: {
    AddressBlock
  }
}
</script>