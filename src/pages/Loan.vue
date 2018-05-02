<template>
    <div>
      <div class="table-padding">
        <router-link :to="{ path: '/loans' }" class="button">
          <div class="icon">
            <i class="fas fa-arrow-left" size="is-small"></i>
          </div>
          <div>{{ $t('lang.common.back') }}</div>
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
            <b-table-column centered class="flex">
              <a  v-if="props.row.type == 'input'" :href="$libre.addressToLink(props.row.data)" target="_blank" class="is-text-overflow">{{props.row.data}}</a>
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
        <div class="level has-text-centered">
          <div class="level-item" v-if="takeEnable">
            <button class="button is-success is-medium" v-bind:class="{'is-loading': btnloading.takeLoan}" v-on:click="loanAction('takeLoan')">
              {{ $t('lang.loans.take') }}
            </button>
          </div>
          <div class="level-item" v-if="returnEnable">
            <button class="button is-danger is-medium" v-bind:class="{'is-loading': btnloading.return}" v-on:click="loanAction('return')">
              {{ $t('lang.loans.return') }}
            </button>
          </div>
          <div class="level-item" v-if="claimEnable">
            <button class="button is-success is-medium" v-bind:class="{'is-loading': btnloading.claim}" v-on:click="loanAction('claim')">
              {{ $t('lang.loans.claim') }}
            </button>
          </div>
          <div class="level-item" v-if="cancelEnable">
            <button class="button is-danger is-medium" v-bind:class="{'is-loading': btnloading.cancel}" v-on:click="loanAction('cancel')">
              {{ $t('lang.common.cancel') }}
            </button>
          </div>
        </div>
        <div class="level"></div>
      </div>
    </div>
</template>

<script>
import Vue from 'vue'
import i18n from '../locales'
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
        address: Vue.config.libre.loans.address,
        amount: ''
      },
      isUpdateRatesActive: false,
      msg: {
        type: 'is-info',
        notes: [i18n.t('lang.common.please-select-action')]
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

          if (loan.status == i18n.t('lang.common.statuses.active')) {
            this.takeEnable = true;
            this.claimEnable = this.returnEnable = false;

            if (loan.holder === this.$eth.yourAccount)
              this.cancelEnable = true;

            let ETHActions = (this.loanType == 'ETH') ? [
              i18n.t('lang.loans.ethactions1'), // It consists of two transactions:
              i18n.t('lang.loans.ethactions2'), // - authorize the transfer tokens
              i18n.t('lang.loans.ethactions3')  // - take offer transaction
            ] : [];

            this.setMessage('warning', [
              i18n.t('lang.loans.message1-1'), // To take a loan you need:
              i18n.t('lang.loans.message1-2'), // 1. The current exchange rate. It consists of two transactions:
              i18n.t('lang.loans.message1-3'), // - requesting rates
              i18n.t('lang.loans.message1-4'), // - rate calculation
              i18n.t('lang.loans.message1-5')  // 2. Available amount of collateral.
            ].concat(ETHActions));
          } else if (loan.status == i18n.t('lang.common.statuses.used')) {
            this.takeEnable = this.cancelEnable = false;
            
            if (loan.holder === this.$eth.yourAccount)
              this.claimEnable = true;

            if (loan.recipient === this.$eth.yourAccount)
              this.returnEnable = true;
          }

          this.loggedIn = (this.$eth._web3.eth.defaultAccount != undefined);

          this.loanData.push(
            {name: i18n.t('lang.loans.type-row'), data: this.$route.params.type},
            {name: i18n.t('lang.loans.id-row'), data: +this.$route.params.id},
            {name: i18n.t('lang.loans.holder-row'), data: loan.holder, type: 'input'}
          )

          if (loan.status != i18n.t('lang.common.statuses.active')) {
            this.loanData.push({name: i18n.t('lang.loans.recipient-row'), data: this.$eth.isZeroAddress(loan.recipient) ? '-' : loan.recipient, type: this.$eth.isZeroAddress(loan.recipient)? '':'input'})
            this.loanData.push({name: i18n.t('lang.loans.take-row'), data: new Date(loan.timestamp * 1000).toLocaleString()})
            this.loanData.push({name: i18n.t('lang.loans.return-row'), data: new Date((loan.timestamp + loan.period) * 1000).toLocaleString()})
          } else {
            this.loanData.push({name: i18n.t('lang.loans.period-row'), data: this.$libre.periodToString(loan.period)})
          }

          this.loanData.push(
            {name: i18n.t('lang.loans.amount-row'), data: this.$eth.fromWei(loan.amount) + " " + this.$route.params.type},
            {name: i18n.t('lang.loans.margin-row'), data: this.$eth.fromWei(loan.margin) + " " + this.$route.params.type},
            {name: i18n.t('lang.loans.refund-row'), data: this.$eth.fromWei(loan.refund) + " " + this.$route.params.type},
            {name: i18n.t('lang.loans.status-row'), data: loan.status}
          )
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },

    async waitMessage(ready, all, price) {
      let action = i18n.t('lang.loans.auth-action');
      let _success = i18n.t('lang.common.success-low');
      
      let disclaimer = `${i18n.t('lang.loans.act-disclaimer')} ${this.$eth.fromWei(price)} ETH)`,
          secondAction = i18n.t('lang.loans.act-2nd-action'); // 2. Rate calculation

      this.setMessage('success', [
        action,
        `${disclaimer} - ${_success}`,
        i18n.t('lang.loans.pls-wait-oracles'), // Please wait while we receive responses from oracles. It may take about 10 minutes...
        '',
        secondAction,
        all == 0 ? '' : i18n.t('lang.loans.oracle-data', {ready: ready, all: all})
      ]);
    },

    async waitOracles() {
      let libre = this.$libre;
      let allOracles = +await libre.bank.oracleCount();
      let price = +await this.$libre.bank.requestPrice();
      return new Promise((resolve, reject) => {
        var i = 1
        var checkInterval = setInterval(async function () {
          if (libre.bankState[+await libre.bank.getState()] != 'WAIT_ORACLES') {
            clearInterval(checkInterval)
            resolve();
          }
          let readyOracles = +await libre.bank.readyOracles();
          await this.waitMessage(readyOracles, allOracles, price);
          i++
          if (i > 500) {
            clearInterval(checkInterval)
            reject('timeout')
          }
        }, 3000)
      })
    },

    async actualizeRates() {
      let txHash;
      let bankState = this.$libre.bankState[+await this.$libre.bank.getState()];
      let action = i18n.t('lang.loans.auth-action');
      let price = +await this.$libre.bank.requestPrice();
      let _waiting = i18n.t('lang.common.tips.waiting'),
          _sending = i18n.t('lang.common.tips.sending'),
          _success = i18n.t('lang.common.success-low'),
          _fail = i18n.t('lang.common.transaction-failed-low');

      let disclaimer = `${i18n.t('lang.loans.act-disclaimer')} ${this.$eth.fromWei(price)} ETH)`,
          secondAction = i18n.t('lang.loans.act-2nd-action'); // 2. Rate calculation
      if (bankState != 'PROCESSING_ORDERS') {
        if (bankState == 'REQUEST_RATES') {
          this.setMessage('info', [action, `${disclaimer} - ${_waiting}`, secondAction]);
          txHash = await this.$libre.bank.requestRates({value: price});
          this.setMessage('info', [action, `${disclaimer} - ${_sending}`, secondAction])
          if (await this.$eth.isSuccess(txHash)) {
            bankState = this.$libre.bankState[+await this.$libre.bank.getState()];
          } else {
            this.setMessage('danger', [action, `${disclaimer} - ${_fail}`, secondAction]);
            return false
          }
        }

        if (bankState == 'WAIT_ORACLES') {
          await this.waitMessage(0, 0, price);
          await this.waitOracles()
          bankState = this.$libre.bankState[+await this.$libre.bank.getState()];
        }

        if (bankState == 'CALC_RATES') {
          this.setMessage('warning', [
            action,
            `${disclaimer} - ${_success}`,
            '',
            '',
            `${secondAction} - ${_waiting}`
          ]);
          txHash = await this.$libre.bank.calcRates();
          this.setMessage('warning', [
            action,
            `${disclaimer} - ${_success}`,
            '',
            '',
            `${secondAction} - ${_sending}`
          ]);
          if (await this.$eth.isSuccess(txHash)) {
            this.setMessage('success', [
              action,
              `${disclaimer} - ${_success}`,
              '',
              '',
              `${secondAction} - ${_success}`
            ]);
          } else {
            this.setMessage('danger', [
              action,
              `${disclaimer} - ${_success}`,
              '',
              '',
              `${secondAction} - ${_fail}`
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
      let allowance = +await this.$libre.token.allowance(this.$eth.yourAccount, Vue.config.libre.deposit.address);
      let _waiting = i18n.t('lang.common.tips.waiting'),
          _sending = i18n.t('lang.common.tips.sending'),
          _success = i18n.t('lang.common.success-low'),
          _fail = i18n.t('lang.common.transaction-failed-low');
      let disclaimer = i18n.t('lang.deposit.available-disclaimer'),
          authDisclaimer = i18n.t('lang.deposit.authorize-disclaimer');
      let action = `1. ${authDisclaimer} ${this.$libre.toToken(amount)} Libre`;
      if (allowance < amount) {
        this.setMessage('warning', [disclaimer, `${action} - ${_waiting}`]);
        let txHash = await this.$libre.token.approve(Vue.config.libre.deposit.address, amount);
        this.setMessage('warning', [disclaimer, `${action} - ${_sending}`]);
        if (await this.$eth.isSuccess(txHash)) {
          this.setMessage('success', [disclaimer, `${action} - ${_success}`]);
        } else {
          this.setMessage('danger', [disclaimer, `${action} - ${_fail}`]);
          return false;
        }
      }
      return true;
    },

    async loanAction(action) {
      try {
        let _waiting = i18n.t('lang.common.tips.waiting'),
            _sending = i18n.t('lang.common.tips.sending'),
            _success = i18n.t('lang.common.success-low'),
            _fail = i18n.t('lang.common.transaction-failed-low');
        let value = 0;
        this.btnloading[action] = true;
        if (action === 'takeLoan' || action == 'claim') {
          if (!(await this.actualizeRates())) {
            this.btnloading[action] = false;
            console.log("error")
            return
          }
          this.loan = this.$libre.getLoanObject(await this.$libre.loans[`getLoan${this.loanType == 'ETH' ? 'Eth' : 'Libre'}`](this.loanId));

          if (this.loanType == 'Libre' && action == 'takeLoan')
            value = this.loan.pledge
        }

        if ((action == 'takeLoan' && this.loanType == 'ETH') || 
            (action == 'return' && this.loanType == 'Libre')) {
          if (!(await this.approveLibre(this.loanType == 'ETH' ? this.loan.pledge : this.loan.refund)))
            return
        }

        this.setMessage('warning', [`${action} tx - ${_waiting}`]);
        let txHash = await (this.$libre.loans[`${action}${this.loanType == 'ETH' ? 'Eth' : 'Libre'}`](this.loanId, {value: value}));
        this.setMessage('warning', [`${action} tx - ${_sending}`]);
        if (await this.$eth.isSuccess(txHash)) {
          this.$libre.notify(`${action} tx - ${_success}`);
          this.setMessage('success', [`${action} tx - ${_success}`]);
          this.loadLoan();
        }
        else {
          this.$libre.notify(`${action} tx - ${_fail}`)
          this.setMessage('danger', [`${action} tx - ${_fail}`]);
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        this.setMessage('danger', [msg]);
        this.$libre.notify(msg, 'is-danger');
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