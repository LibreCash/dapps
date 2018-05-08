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
            <b-table-column :label="$t('lang.common.parameter')">
              <strong>{{ props.row.name }}</strong>
            </b-table-column>
            <td v-if="props.row.data && props.row.type == 'input'" :data-label="$t('lang.common.value-row')" class="flex-mobile">
              <a :href="$libre.addressToLink(props.row.data)" class="is-text-overflow">{{ props.row.data }}</a>
            </td>
            <b-table-column v-if="props.row.type != 'input'" class="flex-mobile" :label="$t('lang.common.value')">
              {{ props.row.data }}
            </b-table-column>
          </template>
        </b-table>
        <div class="level"></div>
        <b-field v-if="btn.takeLoan.enable || btn.return.enable || btn.claim.enable || btn.cancel.enable">
          <b-message :type="msg.type">
            <p v-for="note in msg.notes">
              {{ note }}
            </p>
          </b-message>
        </b-field>
        <div class="level"></div>
        <div class="level has-text-centered">
          <div class="level-item" v-if="btn.takeLoan.enable">
            <button class="button is-success is-medium" v-bind:class="{'is-loading': btn.takeLoan.isLoading}" v-on:click="loanAction('takeLoan')">
              {{ $t('lang.loans.take') }}
            </button>
          </div>
          <div class="level-item" v-if="btn.return.enable">
            <button class="button is-danger is-medium" v-bind:class="{'is-loading': btn.return.isLoading}" v-on:click="loanAction('return')">
              {{ $t('lang.loans.return') }}
            </button>
          </div>
          <div class="level-item" v-if="btn.claim.enable">
            <button class="button is-success is-medium" v-bind:class="{'is-loading': btn.claim.isLoading}" v-on:click="loanAction('claim')">
              {{ $t('lang.loans.claim') }}
            </button>
          </div>
          <div class="level-item" v-if="btn.cancel.enable">
            <button class="button is-danger is-medium" v-bind:class="{'is-loading': btn.cancel.isLoading}" v-on:click="loanAction('cancel')">
              {{ $t('lang.common.cancel') }}
            </button>
          </div>
        </div>
        <div class="level"></div>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loanId: +this.$route.params.id,
      loanType: this.$route.params.type,
      loan: {},
      loanData: [],
      isLoading: false,
      btn: {
        takeLoan: {
            enable: false,
            isLoading: false
        },
        return: {
            enable: false,
            isLoading: false
        },
        claim: {
            enable: false,
            isLoading: false
        },
        cancel: {
            enable: false,
            isLoading: false
        }
      },
      msg: {
        type: 'is-info',
        notes: [this.$t('lang.common.please-select-action')]
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
        this.btn.takeLoan.enable = this.btn.claim.enable = this.btn.cancel.enable = this.btn.return.enable = false;
        this.btn.takeLoan.isLoading = this.btn.return.isLoading = this.btn.claim.isLoading = this.btn.cancel.isLoading = false;

        this.loan = this.$libre.getLoanObject(await this.$libre.loans[`getLoan${this.loanType == 'ETH' ? 'Eth' : 'Libre'}`](this.loanId));

        if (this.loan.status == this.$t('lang.common.statuses.active')) {
          this.btn.takeLoan.enable = true;
          this.btn.claim.enable = this.btn.return.enable = false;

          if (this.loan.holder === this.$eth.yourAccount)
            this.btn.cancel.enable = true;

          let ETHActions = (this.loanType == 'ETH') ? [
            this.$t('lang.loans.ethactions1'), // It consists of two transactions:
            this.$t('lang.loans.ethactions2'), // - authorize the transfer tokens
            this.$t('lang.loans.ethactions3')  // - take offer transaction
          ] : [];

          this.setMessage('warning', [
            this.$t('lang.loans.message1-1'), // To take a loan you need:
            this.$t('lang.loans.message1-2'), // 1. The current exchange rate. It consists of two transactions:
            this.$t('lang.loans.message1-3'), // - requesting rates
            this.$t('lang.loans.message1-4'), // - rate calculation
            this.$t('lang.loans.message1-5')  // 2. Available amount of collateral.
          ].concat(ETHActions));
        } else if (this.loan.status == this.$t('lang.common.statuses.used')) {
          this.btn.takeLoan.enable = this.btn.cancel.enable = false;
          
          if (this.loan.holder === this.$eth.yourAccount)
            this.btn.claim.enable = true;

          if (this.loan.recipient === this.$eth.yourAccount)
            this.btn.return.enable = true;
        }

        this.loanData.push(
          {name: this.$t('lang.loans.type-row'), data: this.$route.params.type},
          {name: this.$t('lang.loans.id-row'), data: +this.$route.params.id},
          {name: this.$t('lang.loans.holder-row'), data: this.loan.holder, type: 'input'}
        )

        if (this.loan.status != this.$t('lang.common.statuses.active')) {
          this.loanData.push({name: this.$t('lang.loans.recipient-row'), data: this.$eth.isZeroAddress(this.loan.recipient) ? '-' : this.loan.recipient, type: this.$eth.isZeroAddress(this.loan.recipient)? '':'input'})
          this.loanData.push({name: this.$t('lang.loans.take-row'), data: this.$d(this.loan.timestamp * 1000, 'long+')});
          this.loanData.push({name: this.$t('lang.loans.return-row'), data: this.$d((this.loan.timestamp + this.loan.period) * 1000, 'long+')});
        } else {
          this.loanData.push({name: this.$t('lang.loans.period-row'), data: this.$libre.periodToString(this.loan.period)});
        }

        this.loanData.push(
          {name: this.$t('lang.loans.amount-row'), data: this.$eth.fromWei(this.loan.amount) + " " + this.$route.params.type},
          {name: this.$t('lang.loans.margin-row'), data: this.$eth.fromWei(this.loan.margin) + " " + this.$route.params.type},
          {name: this.$t('lang.loans.refund-row'), data: this.$eth.fromWei(this.loan.refund) + " " + this.$route.params.type},
          {name: this.$t('lang.loans.status-row'), data: this.loan.status}
        )
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },

    waitMessage(ready, all, price) {
      let action = this.$t('lang.loans.auth-action');
      let _success = this.$t('lang.common.success-low');
      
      let disclaimer = `${this.$t('lang.loans.act-disclaimer')} ${this.$eth.fromWei(price)} ETH)`,
          secondAction = this.$t('lang.loans.act-2nd-action'); // 2. Rate calculation

      this.setMessage('success', [
        action,
        `${disclaimer} - ${_success}`,
        this.$t('lang.loans.pls-wait-oracles'), // Please wait while we receive responses from oracles. It may take about 10 minutes...
        '',
        secondAction,
        all == 0 ? '' : this.$t('lang.loans.oracle-data', {ready, all})
      ]);
    },

    async waitOracles() {
      const oracleTimeout = 11 * 60 * 1000; // 11 minutes
      let libre = this.$libre;
      let allOracles = +await libre.bank.oracleCount();
      let price = +await libre.bank.requestPrice();
      let beginTime = +new Date();
      return new Promise((resolve, reject) => {
        var checkInterval = setInterval(async () => {
          if (libre.bankState[+await libre.bank.getState()] != 'WAIT_ORACLES') {
            clearInterval(checkInterval)
            resolve();
          }
          let readyOracles = +await libre.bank.readyOracles();
          await this.waitMessage(readyOracles, allOracles, price);
          if (+new Date() - beginTime > oracleTimeout) {
            clearInterval(checkInterval)
            reject(this.$t('lang.common.timeout'));
          }
        }, 3000)
      })
    },

    async actualizeRates() {
      let txHash;
      let bankState = this.$libre.bankState[+await this.$libre.bank.getState()];
      let action = this.$t('lang.loans.auth-action');
      let price = +await this.$libre.bank.requestPrice();
      let _waiting = this.$t('lang.common.tips.waiting'),
          _sending = this.$t('lang.common.tips.sending'),
          _success = this.$t('lang.common.success-low'),
          _fail = this.$t('lang.common.transaction-failed-low');

      let disclaimer = `${this.$t('lang.loans.act-disclaimer')} ${this.$eth.fromWei(price)} ETH)`,
          secondAction = this.$t('lang.loans.act-2nd-action'); // 2. Rate calculation
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
      let allowance = +await this.$libre.token.allowance(this.$eth.yourAccount, this.config.loans.address);
      let _waiting = this.$t('lang.common.tips.waiting'),
          _sending = this.$t('lang.common.tips.sending'),
          _success = this.$t('lang.common.success-low'),
          _fail = this.$t('lang.common.transaction-failed-low');
      let disclaimer = this.$t('lang.deposit.available-disclaimer'),
          authDisclaimer = this.$t('lang.deposit.authorize-disclaimer');
      let action = `1. ${authDisclaimer} ${this.$eth.toToken(amount)} Libre`;
      if (allowance < amount) {
        this.setMessage('warning', [disclaimer, `${action} - ${_waiting}`]);
        let txHash = await this.$libre.token.approve(this.config.loans.address, amount);
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
        let _waiting = this.$t('lang.common.tips.waiting'),
            _sending = this.$t('lang.common.tips.sending'),
            _success = this.$t('lang.common.success-low'),
            _fail = this.$t('lang.common.transaction-failed-low');
        let value = 0;
        this.btn[action].isLoading = true;
        if (action === 'takeLoan' || action == 'claim') {
          if (!(await this.actualizeRates())) {
            this.btn[action].isLoading = false;
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

        if (action == 'return' && this.loanType == 'ETH')
            value = this.loan.refund

        this.setMessage('warning', [`${action} tx - ${_waiting}`]);
        let txHash = await (this.$libre.loans[`${action}${this.loanType == 'ETH' ? 'Eth' : 'Libre'}`](this.loanId, {value}));
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
      this.btn[action].isLoading = false
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