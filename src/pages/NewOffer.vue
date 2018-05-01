<template>
  <div>
      <div class="table-padding">
        <div class="level">
          <div class="level-left">          
            <div class="message is-dark">
              <div class="message-header">
                <p>{{ $t('lang.common.your-information') }}</p>
              </div>
              <div class="message-body">
                <address-block></address-block>
                <p>{{ $t('lang.common.allowed') }}: {{ allowed }} Libre</p>
                <p>ETH: {{ balanceETH }} ETH</p>
                <p>Libre: {{ balanceLibre }} Libre</p>
              </div>
            </div>
          </div>
        </div>

        <div class="columns">
          <div class="column is-three-fifths is-offset-one-fifth">
            <div class="message">
              <div class="message-header">
                  <p>{{ $t('lang.loans.loans-creation') }}</p>
              </div>
              <div class="message-body">
                <b-field horizontal label="Type" >
                  <b-select :placeholder="$t('lang.common.select-type')" v-model="selectedType">
                    <option v-for="(key, type) in typeLoans" v-bind:value="key">
                      {{ type }}
                    </option>
                  </b-select>
                </b-field>
                <b-field horizontal :label="$t('lang.common.amount') + ', ' + Object.keys(typeLoans)[selectedType]" :type="isValidAmount(amount) ? '' : 'is-danger'">
                  <b-input v-model="amount" placeholder="0"></b-input>
                  <p class="control">
                    <button class="button is-primary" @click="allAvailable()">{{ $t('lang.common.all-available') }}</button>
                  </p>
                </b-field>
                <b-field horizontal :label="$t('lang.loans.margin-row')" :type="isInteger(margin) ? '' : 'is-danger'">
                  <b-input v-model="margin" placeholder="0"></b-input>
                </b-field>
                <b-field horizontal :label="$t('lang.loans.period-row')" :type="isDebatingPeriod() ? '' : 'is-danger'">
                  <b-datepicker :placeholder="$t('lang.common.click-to-select')" v-model="debatingPeriod" icon="calendar" icon-pack="fas"></b-datepicker>
                  <b-timepicker :placeholder="$t('lang.common.set-time')" icon="clock" v-model="debatingTime" icon-pack="fas"></b-timepicker>
                </b-field>
                <b-field><b-message :type="msg.type" v-if="msg.notes.length != 0">
                  <p v-for="note in msg.notes">
                    {{ note }}
                  </p>
                </b-message></b-field>
                <div class="level">
                  <div class="level-item">
                    <button class="button is-primary is-large" v-bind:class="{'is-loading': isLoadingButton}" v-on:click="createLoan()" v-model="button" :disabled="button.disabled">
                      {{ button.name }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div class="level"></div>
  </div>
</template>

<script>
import AddressBlock from '@/components/AddressBlock'
import i18n from '../locales'
export default {
  data () {
    return {
      daoAddress: '',
      recipient: '',
      amount: '',
      margin: '',
      debatingPeriod: new Date(),
      debatingTime: new Date(),
      button: {name: i18n.t('lang.loans.create-offer'), disabled: true},
      buttonAllowance: {name: i18n.t('lang.common.update-allowance'), disabled: true},
      typeLoans: this.$libre.loansType,
      selectedType: 0,
      allowed: 0,
      balanceETH: 0,
      balanceLibre: 0,
      myAddress: '',
      isOpen: false,
      isOfferOpen: true,
      msg: {
        type: 'is-danger',
        notes: []
      },
      isLoadingButton: false
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

      if (!this.isValidAmount(this.amount))
        valid = false
      else if (!this.isInteger(this.margin))
        valid = false
      else if (!this.isDebatingPeriod())
        valid = false

      this.button.disabled = !valid

      if (this.button.disabled)
        this.setMessage('danger', [i18n.t('lang.common.please-enter-correct-info')]);
      else if (this.selectedType == this.$libre.loansType.Libre && this.allowed < this.amount) {
        this.setMessage('warning', [
          i18n.t('lang.loans.message2-1'), // When creating the offer, you will need to make two transactions:
          `${i18n.t('lang.loans.message2-2')} ${this.amount} Libre`, // 1. Authorize the transfer of
          i18n.t('lang.loans.message2-3') // 2. Create Offer Transaction
        ]);
      } else
        this.setMessage('info', [i18n.t('lang.loans.you-can')]);
    },

    async allAvailable() {
      if (this.selectedType == this.$libre.loansType.ETH) {
        this.amount = this.balanceETH;
      } else {
        this.amount = this.balanceLibre;
      }
    },

    async updateData() {
      this.myAddress = window.web3.eth.defaultAccount;
      this.allowed = this.$libre.toToken(await this.$libre.token.allowance(this.myAddress, this.config.loans.address));
      try {
        this.balanceETH = +this.$eth.fromWei(await this.$eth.getBalance(this.myAddress));
      } catch (err) {
        this.balanceETH = err;
      }
      this.balanceLibre = this.$libre.toToken(await this.$libre.token.balanceOf(window.web3.eth.defaultAccount));
    },

    async approveLibre(amount) {
      let allowance = +await this.$libre.token.allowance(this.$eth.yourAccount, this.config.loans.address);
      let _waiting = i18n.t('lang.common.tips.waiting'),
          _sending = i18n.t('lang.common.tips.sending'),
          _success = i18n.t('lang.common.success-low'),
          _fail = i18n.t('lang.common.transaction-failed-low');
      let disclaimer = i18n.t('lang.deposit.available-disclaimer'),
          authDisclaimer = i18n.t('lang.deposit.authorize-disclaimer');
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
      let _waiting = i18n.t('lang.common.tips.waiting'),
          _sending = i18n.t('lang.common.tips.sending'),
          _success = i18n.t('lang.common.success-low'),
          _fail = i18n.t('lang.common.transaction-failed-low');
      let action = i18n.t('lang.loans.create-offer-transaction');
      let
        txHash,
        now = new Date(),
        debatingEnd = (new Date(this.debatingPeriod))
          .setHours(this.debatingTime.getHours(), this.debatingTime.getMinutes()),
        debatingPeriodInSeconds = Math.round((debatingEnd - now) / 1000);

      if (this.margin == '')
        this.margin = 0

      this.button = {name: i18n.t('lang.common.pending-dots'), disabled: true}
      this.isLoadingButton = true

      try {
        switch(this.selectedType) {
          case this.$libre.loansType.Libre:
            console.log("createLoan",this.allowed, this.amount)
            if (this.allowed < this.amount && !(await this.approveLibre(this.amount))) {
              return
            }
            this.setMessage('info', [
              i18n.t('lang.common.please-confirm-sending'),
              `${action} - ${_waiting}`
            ]);
            txHash = await this.$libre.loans.giveLibre(
              debatingPeriodInSeconds,
              this.$libre.fromToken(+this.amount),
              this.$libre.fromToken(+this.margin)
            )
            this.setMessage('info', [
              i18n.t('lang.common.please-wait-for-sending'),
              `${action} - ${_sending}`
            ]);
            break;
          case this.$libre.loansType.ETH:
            this.setMessage('info', [
              i18n.t('lang.common.please-confirm-sending'),
              `${action} - ${_waiting}`
            ])
            txHash = await this.$libre.loans.giveEth(
              debatingPeriodInSeconds,
              +this.$eth.toWei(this.amount, 'ether'),
              +this.$eth.toWei(this.margin, 'ether'),
              { value: +this.$eth.toWei(this.amount, 'ether') }
            )
            this.setMessage('info', [
              i18n.t('lang.common.please-wait-for-sending'),
              `${action} - ${_sending}`
            ])
            break;
        }

        if (await this.$eth.isSuccess(txHash)) {
          this.$router.push('/loans')
        } else {
          this.$libre.notify(i18n.t('lang.common.creating-error'));
          this.setMessage('danger', [
            i18n.t('lang.common.ended-with-error'),
            action
          ]);
        }
      }
      catch(err) {
        let msg = this.$eth.getErrorMsg(err);
        this.$libre.notify(msg, 'is-danger');
        this.setMessage('danger', [
          `${i18n.t('lang.common.ended-with-error')}: ${action}`,
          msg
        ]);
      }
      this.button = {name: i18n.t('lang.loans.create-offer'), disabled: false}
      this.isLoadingButton = false
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.daoAddress = this.$eth.daoAddress;
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