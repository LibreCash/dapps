<template>
  <div>
      <div class="table-padding">
        <div class="card">
            <div class="card-content">
                <address-block></address-block>
                <p>{{ $t('lang.common.allowed') }}: {{ allowed }} Libre</p>
                <router-link :to="{ path: '/loans' }" class="button">
                    <div class="icon">
                        <i class="fas fa-arrow-left" size="is-small"></i>
                    </div>
                    <div>{{ $t('lang.common.back') }}</div>
                </router-link>
            </div>
        </div>
        <div class="level"></div>
          <div class="column">
                <b-field horizontal  :label="$t('lang.common.type')" >
                  <b-select :placeholder="$t('lang.common.select-type')" v-model="selectedType">
                    <option v-for="(key, type) in $libre.loansType" v-bind:value="key">
                      {{ type }}
                    </option>
                  </b-select>
                </b-field>
                <b-field horizontal :label="$t('lang.common.amount') + ', ' + Object.keys($libre.loansType)[selectedType]">
                  <b-field :type="isValidAmount ? '' : 'is-danger'">
                    <b-input v-model="amount" placeholder="0" expanded></b-input>
                  </b-field>
                  <p class="control">
                    <button class="button is-primary" @click="allAvailable()">{{ $t('lang.common.all-available') }}</button>
                  </p>
                </b-field>
                <b-field horizontal :label="$t('lang.loans.margin-row')" :type="$eth.isInteger(margin) ? '' : 'is-danger'">
                  <b-input v-model="margin" placeholder="0"></b-input>
                </b-field>
                <b-field horizontal :label="$t('lang.loans.period-row')">
                  <b-field :type="+period > 0 ? '' : 'is-danger'" :message="periodToString">
                    <b-input v-model="period" placeholder="0"></b-input>
                  </b-field>
                </b-field>
                <b-field>
                  <b-message :type="msg.type" v-if="msg.notes.length != 0">
                    <p v-for="note in msg.notes">
                      {{ note }}
                    </p>
                  </b-message>
                </b-field>
                <div class="level">
                  <div class="level-item">
                    <button class="button is-primary is-large" v-bind:class="{'is-loading': button.isLoading}" v-on:click="createLoan()" :disabled="button.disabled">
                      {{ button.name }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
    <div class="level"></div>
  </div>
</template>

<script>
import AddressBlock from '@/components/AddressBlock'
export default {
  data () {
    return {
      amount: '',
      margin: '',
      period: '',
      button: {
        name: t('lang.loans.create-offer'),
        disabled: true,
        isLoading: false
      },
      selectedType: 0,
      allowed: 0,
      msg: {
        type: 'is-danger',
        notes: []
      }
    }
  },
  computed: {
    periodToString() {
      let daysInSeconds = this.$eth.isInteger(this.period) ? parseInt(+this.period) * 24 * 60 * 60 : 0;
      return this.$libre.periodToString(daysInSeconds).slice(0,-9);
    },
    
    isValidAmount() {
      return this.$eth.isInteger(this.amount) && +this.amount > 0 && (
        (this.selectedType == this.$libre.loansType.Libre && this.amount <= this.$store.state.balances.libre) ||
        (this.selectedType == this.$libre.loansType.ETH && this.amount < this.$store.state.balances.eth) /* '<' not '<=' cause tx fee */
      )
    }
  },
  methods: {
    setMessage(type, notes) {
      this.msg = {
        type: `is-${type}`,
        notes: notes
      }
    },

    validData() {
      let valid = true

      if (!this.isValidAmount || 
          !this.$eth.isInteger(this.margin) ||
          +this.period <= 0)
        valid = false

      this.button.disabled = !valid

      if (this.button.disabled)
        this.setMessage('danger', [t('lang.common.please-enter-correct-info')]);
      else if (this.selectedType == this.$libre.loansType.Libre && this.allowed < this.amount) {
        this.setMessage('warning', [
          t('lang.loans.message2-1'), // When creating the offer, you will need to make two transactions:
          `${t('lang.loans.message2-2')} ${this.amount} Libre`, // 1. Authorize the transfer of
          t('lang.loans.message2-3') // 2. Create Offer Transaction
        ]);
      } else
        this.setMessage('info', [t('lang.loans.you-can')]);
    },

    async allAvailable() {
      if (this.selectedType == this.$libre.loansType.ETH) {
        this.amount = this.$store.state.balances.eth;
      } else {
        this.amount = this.$store.state.balances.libre;
      }
    },

    async updateData() {
      this.allowed = this.$eth.toToken(await this.$libre.token.allowance(this.$store.state.address, this.config.loans.address));
      this.$store.dispatch('updateBalances', {
          libre: this.$libre.token.balanceOf,
          lbrs: this.$libre.liberty.balanceOf,
          eth: this.$eth.getBalance,
          ethConverter: this.$eth.fromWei,
          tokenConverter: this.$eth.toToken,
          address: this.$eth.loadAccounts
      })
    },

    async approveLibre(amount) {
      let allowance = +await this.$libre.token.allowance(this.$store.state.address, this.config.loans.address);
      let _waiting = t('lang.common.tips.waiting'),
          _sending = t('lang.common.tips.sending'),
          _success = t('lang.common.success-low'),
          _fail = t('lang.common.transaction-failed-low');
      let disclaimer = t('lang.deposit.available-disclaimer'),
          authDisclaimer = t('lang.deposit.authorize-disclaimer');
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

    async createLoan() {
      let _waiting = t('lang.common.tips.waiting'),
          _sending = t('lang.common.tips.sending'),
          _success = t('lang.common.success-low'),
          _fail = t('lang.common.transaction-failed-low');
      let action = t('lang.loans.create-offer-transaction');
      let
        txHash,
        debatingPeriodInSeconds = parseInt(this.period) * 24 * 60 * 60;

      if (this.margin == '')
        this.margin = 0

      this.button.disabled = true
      this.button.isLoading = true

      try {
        switch(this.selectedType) {
          case this.$libre.loansType.Libre:
            console.log("createLoan",this.allowed, this.amount)
            if (this.allowed < this.amount && !(await this.approveLibre(this.$eth.fromToken(this.amount)))) {
              return
            }
            this.setMessage('info', [
              t('lang.common.please-confirm-sending'),
              `${action} - ${_waiting}`
            ]);
            txHash = await this.$libre.loans.giveLibre(
              debatingPeriodInSeconds,
              this.$eth.fromToken(+this.amount),
              this.$eth.fromToken(+this.margin)
            )
            this.setMessage('info', [
              t('lang.common.please-wait-for-sending'),
              `${action} - ${_sending}`
            ]);
            break;
          case this.$libre.loansType.ETH:
            this.setMessage('info', [
              t('lang.common.please-confirm-sending'),
              `${action} - ${_waiting}`
            ])
            txHash = await this.$libre.loans.giveEth(
              debatingPeriodInSeconds,
              +this.$eth.toWei(this.amount, 'ether'),
              +this.$eth.toWei(this.margin, 'ether'),
              { value: +this.$eth.toWei(this.amount, 'ether') }
            )
            this.setMessage('info', [
              t('lang.common.please-wait-for-sending'),
              `${action} - ${_sending}`
            ])
            break;
        }

        if (await this.$eth.isSuccess(txHash)) {
          this.$router.push('/loans')
        } else {
          this.$libre.notify(t('lang.loans.creating-error'),'is-info');
          this.setMessage('danger', [
            t('lang.common.ended-with-error'),
            action
          ]);
        }
      }
      catch(err) {
        let msg = this.$eth.getErrorMsg(err);
        this.$libre.notify(msg, 'is-danger');
        this.setMessage('danger', [
          `${t('lang.common.ended-with-error')}:`,
          msg
        ]);
      }
      this.button.disabled = false
      this.button.isLoading = false
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.updateData()
    } catch (err) {
      console.log(err)
    }
  },
  watch: {
    amount: function() {this.validData()},
    period: function() {this.validData()},
    margin: function() {this.validData()},
    selectedType: function() {
      this.amount = this.margin = '';
    }
  },
  components: {
    AddressBlock
  }
}
</script>