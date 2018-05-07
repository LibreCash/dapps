<template>
  <div>
      <div class="table-padding">
        <div class="card">
            <div class="card-content">
                <p>{{ $t('lang.common.your-information') }}</p>
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
                <b-field horizontal label="Type" >
                  <b-select :placeholder="$t('lang.common.select-type')" v-model="selectedType">
                    <option v-for="(key, type) in $libre.loansType" v-bind:value="key">
                      {{ type }}
                    </option>
                  </b-select>
                </b-field>
                <b-field horizontal :label="$t('lang.common.amount') + ', ' + Object.keys($libre.loansType)[selectedType]" :type="isValidAmount(amount) ? '' : 'is-danger'">
                  <b-input v-model="amount" placeholder="0"></b-input>
                  <p class="control">
                    <button class="button is-primary" @click="allAvailable()">{{ $t('lang.common.all-available') }}</button>
                  </p>
                </b-field>
                <b-field horizontal :label="$t('lang.loans.margin-row')" :type="isInteger(margin) ? '' : 'is-danger'">
                  <b-input v-model="margin" placeholder="0"></b-input>
                </b-field>
                <b-field horizontal :label="$t('lang.loans.period-row')">
                    <b-field :type="isDebatingPeriod() ? '' : 'is-danger'">
                        <b-datepicker 
                            :placeholder="$t('lang.common.click-to-select')"
                            v-model="debatingPeriod"
                            icon="calendar"
                            icon-pack="fas"
                            expanded></b-datepicker>
                    </b-field>
                    <b-field :type="isDebatingPeriod() ? '' : 'is-danger'">
                        <b-timepicker 
                            :placeholder="$t('lang.common.set-time')"
                            icon="clock"
                            v-model="debatingTime"
                            icon-pack="fas"
                            expanded></b-timepicker>
                    </b-field>
                </b-field>
                <b-field><b-message :type="msg.type" v-if="msg.notes.length != 0">
                  <p v-for="note in msg.notes">
                    {{ note }}
                  </p>
                </b-message></b-field>
                <div class="level">
                  <div class="level-item">
                    <button class="button is-primary is-large" v-bind:class="{'is-loading': button.isLoading}" v-on:click="createLoan()" v-model="button" :disabled="button.disabled">
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
      debatingPeriod: new Date(),
      debatingTime: new Date(),
      button: {
        name: this.$t('lang.loans.create-offer'),
        disabled: true,
        isLoading: false
      },
      selectedType: 0,
      allowed: 0,
      balanceETH: 0,
      balanceLibre: 0,
      msg: {
        type: 'is-danger',
        notes: []
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

    isInteger(number) {
      return +number >= 0
    },

    isValidAmount(number) {
      return this.isInteger(number) && number > 0 && (
        (this.selectedType == this.$libre.loansType.Libre && number <= this.balanceLibre ) ||
        (this.selectedType == this.$libre.loansType.ETH && number < this.balanceETH) /* '<' not '<=' cause tx fee */
      )
    },

    isDebatingPeriod() {
      if (this.debatingEnd) 
        return false

      let 
        now = Date.now(),
        debatingEnd = new Date(this.debatingPeriod)
      // Refactor it  
      debatingEnd.setHours(this.debatingTime.getHours(),this.debatingTime.getMinutes())

      return (debatingEnd - now) > 0
    },

    validData() {
      let valid = true

      if (!this.isValidAmount(this.amount) || 
          !this.isInteger(this.margin) ||
          !this.isDebatingPeriod())
        valid = false

      this.button.disabled = !valid

      if (this.button.disabled)
        this.setMessage('danger', [this.$t('lang.common.please-enter-correct-info')]);
      else if (this.selectedType == this.$libre.loansType.Libre && this.allowed < this.amount) {
        this.setMessage('warning', [
          this.$t('lang.loans.message2-1'), // When creating the offer, you will need to make two transactions:
          `${this.$t('lang.loans.message2-2')} ${this.amount} Libre`, // 1. Authorize the transfer of
          this.$t('lang.loans.message2-3') // 2. Create Offer Transaction
        ]);
      } else
        this.setMessage('info', [this.$t('lang.loans.you-can')]);
    },

    async allAvailable() {
      if (this.selectedType == this.$libre.loansType.ETH) {
        this.amount = this.balanceETH;
      } else {
        this.amount = this.balanceLibre;
      }
    },

    async updateData() {
      this.allowed = this.$libre.toToken(await this.$libre.token.allowance(this.$eth.yourAccount, this.config.loans.address));
      try {
        this.balanceETH = +this.$eth.fromWei(await this.$eth.getBalance(this.$eth.yourAccount));
      } catch (err) {
        this.balanceETH = err;
      }
      this.balanceLibre = this.$libre.toToken(await this.$libre.token.balanceOf(this.$eth.yourAccount));
    },

    async approveLibre(amount) {
      let allowance = +await this.$libre.token.allowance(this.$eth.yourAccount, this.config.loans.address);
      let _waiting = this.$t('lang.common.tips.waiting'),
          _sending = this.$t('lang.common.tips.sending'),
          _success = this.$t('lang.common.success-low'),
          _fail = this.$t('lang.common.transaction-failed-low');
      let disclaimer = this.$t('lang.deposit.available-disclaimer'),
          authDisclaimer = this.$t('lang.deposit.authorize-disclaimer');
      let action = `1. ${authDisclaimer} ${this.$libre.toToken(amount)} Libre`;
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
      let _waiting = this.$t('lang.common.tips.waiting'),
          _sending = this.$t('lang.common.tips.sending'),
          _success = this.$t('lang.common.success-low'),
          _fail = this.$t('lang.common.transaction-failed-low');
      let action = this.$t('lang.loans.create-offer-transaction');
      let
        txHash,
        now = new Date(),
        debatingEnd = (new Date(this.debatingPeriod))
          .setHours(this.debatingTime.getHours(), this.debatingTime.getMinutes()),
        debatingPeriodInSeconds = Math.round((debatingEnd - now) / 1000);

      if (this.margin == '')
        this.margin = 0

      this.button.disabled = true
      this.button.isLoading = true

      try {
        switch(this.selectedType) {
          case this.$libre.loansType.Libre:
            console.log("createLoan",this.allowed, this.amount)
            if (this.allowed < this.amount && !(await this.approveLibre(this.$libre.fromToken(this.amount)))) {
              return
            }
            this.setMessage('info', [
              this.$t('lang.common.please-confirm-sending'),
              `${action} - ${_waiting}`
            ]);
            txHash = await this.$libre.loans.giveLibre(
              debatingPeriodInSeconds,
              this.$libre.fromToken(+this.amount),
              this.$libre.fromToken(+this.margin)
            )
            this.setMessage('info', [
              this.$t('lang.common.please-wait-for-sending'),
              `${action} - ${_sending}`
            ]);
            break;
          case this.$libre.loansType.ETH:
            this.setMessage('info', [
              this.$t('lang.common.please-confirm-sending'),
              `${action} - ${_waiting}`
            ])
            txHash = await this.$libre.loans.giveEth(
              debatingPeriodInSeconds,
              +this.$eth.toWei(this.amount, 'ether'),
              +this.$eth.toWei(this.margin, 'ether'),
              { value: +this.$eth.toWei(this.amount, 'ether') }
            )
            this.setMessage('info', [
              this.$t('lang.common.please-wait-for-sending'),
              `${action} - ${_sending}`
            ])
            break;
        }

        if (await this.$eth.isSuccess(txHash)) {
          this.$router.push('/loans')
        } else {
          this.$libre.notify(this.$t('lang.common.creating-error'));
          this.setMessage('danger', [
            this.$t('lang.common.ended-with-error'),
            action
          ]);
        }
      }
      catch(err) {
        let msg = this.$eth.getErrorMsg(err);
        this.$libre.notify(msg, 'is-danger');
        this.setMessage('danger', [
          `${this.$t('lang.common.ended-with-error')}:`,
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
    debatingPeriod: function() {this.validData()},
    debatingTime: function() {this.validData()},
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