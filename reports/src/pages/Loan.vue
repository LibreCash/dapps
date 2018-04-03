<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">{{ loanType }} Loan #{{ loanId }}</h2>
      </div>
      <br>
      <div class="table-padding">
        <button @click="$router.go(-1)" :to="{ path: '/loans' }" class="button">
          <b-icon icon="keyboard-return" size="is-small"></b-icon>
          <span>Back</span>
        </button>
        <span class="icon arrow-left"><i class="arrow-left"></i></span>
        <b-table :data="loanData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="isLoading"
          :mobile-cards="true">
          <template slot-scope="props">
            <b-table-column>
              <strong>{{ props.row.name }}</strong>
            </b-table-column>
            <b-table-column centered>
              <input class="address" v-if="props.row.type == 'input'" type="text" :value="props.row.data" disabled="disabled" size="25">
              <span v-else>{{ props.row.data }}</span>
            </b-table-column>
          </template>
        </b-table>
        <br>
        <b-field v-if="takeEnable || returnEnable || claimEnable || cancelEnable">
          <b-message :type="msg.type" style="white-space: pre-wrap;">{{ msg.text }}</b-message>
        </b-field>
        <br>
        <div class="columns">
          <div class="column" v-if="takeEnable">
            <button v-bind:class="{'button is-success': true, 'is-loading': btnloading.takeLoan}" v-on:click="loanAction('takeLoan')">Take</button>
          </div>
          <div class="column" v-if="returnEnable">
            <button v-bind:class="{'button is-danger': true, 'is-loading': btnloading.return}" v-on:click="loanAction('return')">Return</button>
          </div>
          <div class="column" v-if="claimEnable">
            <button v-bind:class="{'button is-success': true, 'is-loading': btnloading.claim}" v-on:click="loanAction('claim')">Claim</button>
          </div>
          <div class="column" v-if="cancelEnable">
            <button v-bind:class="{'button is-danger': true, 'is-loading': btnloading.cancel}" v-on:click="loanAction('cancel')">Cancel</button>
          </div>
        </div>
      </div>
      
    </section>
    </div>
</template>

<script>
import Config from '@/config'
export default {
  data () {
    return {
      loanId: +this.$route.params.id,
      loanType: this.$route.params.type,
      loan: {},
      loanData: [],
      isLoading: false,
      takeEnable: false,
      returnEnable: false,
      claimEnable: false,
      cancelEnable: false,
      isAllowanceActive: false,
      btnloading: {
        takeLoan: false,
        return: false,
        claim: false,
        cancel: false
      },
      approve: {
        address: Config.loans.address,
        amount: ''
      },
      isUpdateRatesActive: false,
      msg: {
        type: 'is-info',
        text: 'Please select to action'
      }
    }
  },
  methods: {
    setMessage(type, message) {
      this.msg = {
        type: `is-${type}`,
        text: message
      }
    },

    async loadLoan () {
      this.loanData = []
      this.isLoading = true

      try {
        this.takeEnable = this.claimEnable = this.cancelEnable = this.returnEnable = false
        this.btnloading = {
          takeLoan: false,
          return: false,
          claim: false,
          cancel: false
        }
          let 
            loan = this.$libre.getLoanObject(await this.$libre.loans[`getLoan${this.loanType == 'ETH' ? 'Eth' : 'Libre'}`](this.loanId));
            this.loan = loan;

          if (loan.status == 'active') {
            this.takeEnable = true;
            this.claimEnable = this.returnEnable = false;

            if (loan.holder === this.$eth.yourAccount)
              this.cancelEnable = true;

            this.setMessage('warning',`To take a loan you need:\n1. The current exchange rate. It consists of two transactions:\n- request rate\n- rate calculation\n2. Available amount of collateral. ${this.loanType == 'ETH'? 'It consists two transactions:\n- authorize the transfer tokens\n- take offer transaction' : ''}`)
          } else if (loan.status == 'used') {
            this.takeEnable = this.cancelEnable = false;
            
            if (loan.holder === this.$eth.yourAccount)
              this.claimEnable = true;

            if (loan.recipient === this.$eth.yourAccount)
              this.returnEnable = true;
          }


          this.loanData.push({name: 'Type', data: this.$route.params.type})
          this.loanData.push({name: 'ID', data: +this.$route.params.id})
          this.loanData.push({name: 'Holder', data: loan.holder, type: 'input'})

          if (loan.status != 'active') {
            this.loanData.push({name: 'Recipient', data: this.$eth.isZeroAddress(loan.recipient) ? '-' : loan.recipient, type: this.$eth.isZeroAddress(loan.recipient)? '':'input'})
            this.loanData.push({name: 'Take', data: new Date(loan.timestamp * 1000).toLocaleString()})
            this.loanData.push({name: 'Return', data: new Date((loan.timestamp + loan.period) * 1000).toLocaleString()})
          } else {
            this.loanData.push({name: 'Period', data: this.periodToString(loan.period)})
          }

          this.loanData.push({name: 'Amount', data: this.$eth.fromWei(loan.amount)})
          this.loanData.push({name: 'Margin', data: this.$eth.fromWei(loan.margin)})
          this.loanData.push({name: 'Refund', data: this.$eth.fromWei(loan.refund)})
          this.loanData.push({name: 'Status', data: loan.status})
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },

    periodToString(seconds) {
      var years = Math.floor(seconds / (60 * 60 * 24 * 365));
      seconds -= years * 60 * 60 * 24 * 365;

      var months = Math.floor(seconds / (60 * 60 * 24 * 30));
      seconds -= months * 60 * 60 * 24 * 30;

      var days = Math.floor(seconds / (60 * 60 * 24));
      seconds -= days * 60 * 60 * 24;

      var hours   = Math.floor(seconds / (60 * 60));
      seconds -= hours * 60 * 60;

      var minutes = Math.floor(seconds / 60);
      seconds -= minutes * 60;

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return `${years}y ${months}m ${days}d ${hours}:${minutes}:${seconds}`;
    },

    waitOracles() {
      let libre = this.$libre;
      return new Promise((resolve, reject) => {
        var i = 1
        var checkInterval = setInterval(async function () {
          if (libre.bankState[+await libre.bank.getState()] != 'WAIT_ORACLES') {
            clearInterval(checkInterval)
            resolve();
          }
          i++
          if (i > 50) {
            clearInterval(checkInterval)
            reject('timeout')
          }
        }, 3000)
      })
    },

    async actualizeRates() {
      let txHash;
      let bankState = this.$libre.bankState[+await this.$libre.bank.getState()];
      if (bankState != 'PROCESSING_ORDERS') {
        if (bankState == 'REQUEST_RATES') {
          let price = +await this.$libre.bank.requestPrice();
          this.setMessage('info',`Get current exchange rate:\n1. Request rate (cost ${this.$eth.fromWei(price)} ETH) - wait confirm...\n2. Rate calculation`);
          txHash = await this.$libre.bank.requestRates({value: price});
          this.setMessage('info',`Get current exchange rate:\n1. Request rate (cost ${this.$eth.fromWei(price)} ETH) - send to the network...\n2. Rate calculation`)
          if (await this.$eth.isSuccess(txHash)) {
            bankState = this.$libre.bankState[+await this.$libre.bank.getState()];
          } else {
            this.setMessage('danger',`Get current exchange rate:\n1. Request rate (cost ${this.$eth.fromWei(price,'ether')} ETH) - fail transaction...\n2. Rate calculation`)
            return false
          }
        }

        if (bankState == 'WAIT_ORACLES') {
          this.setMessage('success',`Get current exchange rate:\n1. request rate - successfully...\nPlease wait while we receive a response from the oracles. This may take about 10 minutes...\n\n2. rate calculation`)
          await this.waitOracles()
          bankState = this.$libre.bankState[+await this.$libre.bank.getState()];
        }

        if (bankState == 'CALC_RATES') {
          this.setMessage('warning',`Get current exchange rate:\n1. request rate - successfully\n2. rate calculation - wait confirm...`)
          txHash = await this.$libre.bank.calcRates();
          this.setMessage('warning',`Get current exchange rate:\n1. request rate - successfully\n2. rate calculation - send to the network...`)
          if (await this.$eth.isSuccess(txHash)) {
            this.setMessage('success',`Get current exchange rate:\n1. request rate - successfully\n2. rate calculation - successfully...`)
          } else {
            this.setMessage('danger',`Get current exchange rate:\n1. request rate - successfully...\n2. rate calculation - fail transaction...`)
            return false
          }
        } else {
          return false
        }
      }

      return true
    },

    async approveLibre(amount) {
      console.log(amount)
      let allowance = +await this.$libre.token.allowance(this.myAddress, Config.loans.address)
      if (allowance < this.loan.pledge) {
        this.setMessage('warning',`Available amount of collateral:\n1. Authorize the transfer ${this.$libre.toToken(amount)} Libre tokens - wait confirm...`)
        let txHash = await this.$libre.token.approve(Config.loans.address, amount);
        this.setMessage('warning',`Available amount of collateral:\n1. Authorize the transfer ${this.$libre.toToken(amount)} Libre tokens - send to the network...`)
        if (await this.$eth.isSuccess(txHash)) {
          this.setMessage('success',`Available amount of collateral:\n1. Authorize the transfer ${this.$libre.toToken(amount)} Libre tokens - successfully...`)
        } else {
          this.setMessage('danger',`Available amount of collateral:\n1. Authorize the transfer ${this.$libre.toToken(amount)} Libre tokens - fail transaction...`)
          return false
        }
      }
      return true
    },

    async loanAction(action) {
      try {
        let value = 0;
        this.btnloading[action] = true
        if (action === 'takeLoan' || action == 'claim') {
          if (!(await this.actualizeRates()))
            return

          this.loan = this.$libre.getLoanObject(await this.$libre.loans[`getLoan${this.loanType == 'ETH' ? 'Eth' : 'Libre'}`](this.loanId));

          if (this.loanType == 'Libre')
           value = this.loan.pledge
        }

        if ((action == 'takeLoan' && this.loanType == 'ETH') || 
            (action == 'return' && this.loanType == 'Libre')) {
          if (!(await this.approveLibre(this.loanType == 'ETH' ? this.loan.pledge : this.loan.refund)))
            return
        }

        this.setMessage('warning',`${action} transaction - wait confirm...`)
        let txHash = await (this.$libre.loans[`${action}${this.loanType == 'ETH' ? 'Eth' : 'Libre'}`](this.loanId,{value: value}));
        this.setMessage('warning',`${action} transaction - send to the network...`)
        if (await this.$eth.isSuccess(txHash)) {
          this.$snackbar.open(`${action} transaction - successfully`)
          this.setMessage('success',`${action} transaction - successfully...`)
          this.loadLoan()
        }
        else {
          this.$snackbar.open(`${action} transaction - fail`)
          this.setMessage('danger',`${action} transaction - fail transaction...`)
        }
      }catch(e) {
        let msg = this.$eth.getErrorMsg(e)
        console.log(msg)
        this.$snackbar.open(msg);
      }
      this.btnloading[action] = false
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.loadLoan()
    } catch (err) {
      console.log(err)
    }
  }
}
</script>