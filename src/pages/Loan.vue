<template>
    <div>
      <div class="table-padding">
        <router-link :to="{ path: '/loans' }" class="button">
          <b-icon icon="keyboard-return" size="is-small"></b-icon>
          <span>Back</span>
        </router-link>
        <div class="level"></div>
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
        <div class="level"></div>
        <b-field v-if="takeEnable || returnEnable || claimEnable || cancelEnable">
          <b-message :type="msg.type">
            <p v-for="note in msg.notes">
              {{ note }}
            </p>
          </b-message>
        </b-field>
        <div class="level"></div>
        <div class="level" v-if="loggedIn">
          <div class="level-item has-text-centered" v-if="takeEnable">
            <button class="button is-success is-medium" v-bind:class="{'is-loading': btnloading.takeLoan}" v-on:click="loanAction('takeLoan')">Take</button>
          </div>
          <div class="level-item has-text-centered" v-if="returnEnable">
            <button class="button is-danger is-medium" v-bind:class="{'is-loading': btnloading.return}" v-on:click="loanAction('return')">Return</button>
          </div>
          <div class="level-item has-text-centered" v-if="claimEnable">
            <button class="button is-success is-medium" v-bind:class="{'is-loading': btnloading.claim}" v-on:click="loanAction('claim')">Claim</button>
          </div>
          <div class="level-item has-text-centered" v-if="cancelEnable">
            <button class="button is-danger is-medium" v-bind:class="{'is-loading': btnloading.cancel}" v-on:click="loanAction('cancel')">Cancel</button>
          </div>
        </div>
        <div class="level"></div>
      </div>
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
      loggedIn: false,
      isAllowanceActive: false,
      btnloading: {
        takeLoan: false,
        return: false,
        claim: false,
        cancel: false
      },
      approve: {
        address: Config.loans.address[this.$eth.network],
        amount: ''
      },
      isUpdateRatesActive: false,
      msg: {
        type: 'is-info',
        notes: ['Please select an action']
      }
    }
  },
  methods: {
    setMessage(type, notes) {
      this.msg = {
        type: `is-${type}`,
        notes: notes
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

            let ETHActions = this.loanType == 'ETH' ? [
              'It consists two transactions:', 
              '- authorize the transfer tokens',
              '- take offer transaction'
            ] : [];

            this.setMessage('warning', [
              'To take a loan you need:',
              '1. The current exchange rate. It consists of two transactions:',
              '- requesting rates',
              '- rate calculation',
              '2. Available amount of collateral.'
            ].concat(ETHActions));
          } else if (loan.status == 'used') {
            this.takeEnable = this.cancelEnable = false;
            
            if (loan.holder === this.$eth.yourAccount)
              this.claimEnable = true;

            if (loan.recipient === this.$eth.yourAccount)
              this.returnEnable = true;
          }

          this.loggedIn = (this.$eth._web3.eth.defaultAccount != undefined);

          this.loanData.push({name: 'Type', data: this.$route.params.type})
          this.loanData.push({name: 'ID', data: +this.$route.params.id})
          this.loanData.push({name: 'Holder', data: loan.holder, type: 'input'})

          if (loan.status != 'active') {
            this.loanData.push({name: 'Recipient', data: this.$eth.isZeroAddress(loan.recipient) ? '-' : loan.recipient, type: this.$eth.isZeroAddress(loan.recipient)? '':'input'})
            this.loanData.push({name: 'Take', data: new Date(loan.timestamp * 1000).toLocaleString()})
            this.loanData.push({name: 'Return', data: new Date((loan.timestamp + loan.period) * 1000).toLocaleString()})
          } else {
            this.loanData.push({name: 'Period', data: this.$libre.periodToString(loan.period)})
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
      let action = 'Getting current exchange rate:';
      let price = +await this.$libre.bank.requestPrice();
      let disclaimer = `1. Requesting rates (cost ${this.$eth.fromWei(price)} ETH)`;
      if (bankState != 'PROCESSING_ORDERS') {
        if (bankState == 'REQUEST_RATES') {
          this.setMessage('info', [action, `${disclaimer} - waiting for confirmations...`, '2. Rate calculation']);
          txHash = await this.$libre.bank.requestRates({value: price});
          this.setMessage('info', [action, `${disclaimer} - sending to the network...`, '2. Rate calculation'])
          if (await this.$eth.isSuccess(txHash)) {
            bankState = this.$libre.bankState[+await this.$libre.bank.getState()];
          } else {
            this.setMessage('danger', [action, `${disclaimer} - transaction failed...`, '2. Rate calculation']);
            return false
          }
        }

        if (bankState == 'WAIT_ORACLES') {
          this.setMessage('success', [
            action,
            `${disclaimer} - success`,
            'Please wait while we receive responses from oracles. It may take about 10 minutes...',
            '',
            '2. rate calculation'
          ]);
          await this.waitOracles()
          bankState = this.$libre.bankState[+await this.$libre.bank.getState()];
        }

        if (bankState == 'CALC_RATES') {
          this.setMessage('warning', [
            action,
            `${disclaimer} - success`,
            '',
            '',
            '2. rate calculation - waiting for confirmations...'
          ]);
          txHash = await this.$libre.bank.calcRates();
          this.setMessage('warning', [
            action,
            `${disclaimer} - success`,
            '',
            '',
            '2. rate calculation - sending to the network...'
          ]);
          if (await this.$eth.isSuccess(txHash)) {
            this.setMessage('success', [
              action,
              `${disclaimer} - success`,
              '',
              '',
              '2. rate calculation - success'
            ]);
          } else {
            this.setMessage('danger', [
              action,
              `${disclaimer} - success`,
              '',
              '',
              '2. rate calculation - transaction failed'
              ]);
            return false;
          }
        } else {
          return false;
        }
      }

      return true;
    },

    async approveLibre(amount) {
      let allowance = +await this.$libre.token.allowance(this.$eth.yourAccount, Config.deposit.address[this.$eth.network]);
      let disclaimer = 'Available amount for deposit:';
      let action = `1. Authorize the transfer ${this.$libre.toToken(amount)} Libre tokens`;
      if (allowance < amount) {
        this.setMessage('warning', [disclaimer, `${action} - waiting for confirmations...`]);
        let txHash = await this.$libre.token.approve(Config.deposit.address[this.$eth.network], amount);
        this.setMessage('warning', [disclaimer, `${action} - sending to the network...`]);
        if (await this.$eth.isSuccess(txHash)) {
          this.setMessage('success', [disclaimer, `${action} - success`]);
        } else {
          this.setMessage('danger', [disclaimer, `${action} - transaction failed`]);
          return false;
        }
      }
      return true;
    },

    async loanAction(action) {
      try {
        let value = 0;
        this.btnloading[action] = true
        if (action === 'takeLoan' || action == 'claim') {
          if (!(await this.actualizeRates()))
            return

          this.loan = this.$libre.getLoanObject(await this.$libre.loans[`getLoan${this.loanType == 'ETH' ? 'Eth' : 'Libre'}`](this.loanId));

          if (this.loanType == 'Libre' && action == 'takeLoan')
            value = this.loan.pledge
        }

        if ((action == 'takeLoan' && this.loanType == 'ETH') || 
            (action == 'return' && this.loanType == 'Libre')) {
          if (!(await this.approveLibre(this.loanType == 'ETH' ? this.loan.pledge : this.loan.refund)))
            return
        }

        this.setMessage('warning', [`${action} transaction - waiting for confirmation...`]);
        let txHash = await (this.$libre.loans[`${action}${this.loanType == 'ETH' ? 'Eth' : 'Libre'}`](this.loanId, {value: value}));
        this.setMessage('warning', [`${action} transaction - sending to the network...`]);
        if (await this.$eth.isSuccess(txHash)) {
          this.$snackbar.open(`${action} transaction - success`);
          this.setMessage('success', [`${action} transaction - success`]);
          this.loadLoan();
        }
        else {
          this.$snackbar.open(`${action} transaction - fail`)
          this.setMessage('danger', [`${action} transaction - transaction failed`]);
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
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