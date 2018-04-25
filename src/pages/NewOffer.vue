<template>
  <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">New Loan Offer</h2>
      </div>
      <div class="level"></div>
      <div class="table-padding">
        <div class="level">
          <div class="level-left">          
            <div class="message is-dark">
              <div class="message-header">
                <p>Your information</p>
              </div>
              <div class="message-body">
                <address-block></address-block>
                <p>Balances:</p>
                <p>Allowed: {{ allowed }} Libre</p>
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
                  <p>Loans Creation</p>
              </div>
              <div class="message-body">
                <b-field horizontal label="Type" >
                  <b-select placeholder="Select loan offer type" v-model="selectedType">
                    <option v-for="(key, type) in typeLoans" v-bind:value="key">
                      {{ type }}
                    </option>
                  </b-select>
                </b-field>
                <b-field horizontal :label="'Amount, ' + Object.keys(typeLoans)[selectedType]" :type="isValidAmount(amount) ? '' : 'is-danger'">
                  <b-input v-model="amount" placeholder="0"></b-input>
                  <p class="control">
                    <button class="button is-primary" @click="allAvailable()">All available</button>
                  </p>
                </b-field>
                <b-field horizontal label="Margin" :type="isInteger(margin) ? '' : 'is-danger'">
                  <b-input v-model="margin" placeholder="0"></b-input>
                </b-field>
                <b-field horizontal label="Offer period:" :type="isDebatingPeriod() ? '' : 'is-danger'">
                  <b-datepicker placeholder="Click to select..." v-model="debatingPeriod" icon="calendar-today"></b-datepicker>
                  <b-timepicker placeholder="Set time..." icon="clock" v-model="debatingTime"></b-timepicker>
                </b-field>
                <b-field><b-message :type="msg.type" style="white-space: pre-wrap;">
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
    </section>
    <div class="level"></div>
  </div>
</template>

<script>
import Config from '@/config'
import AddressBlock from '@/components/AddressBlock'
export default {
  data () {
    return {
      daoAddress: '',
      recipient: '',
      amount: '',
      margin: '',
      debatingPeriod: new Date(),
      debatingTime: new Date(),
      button: {name: 'Create Offer', disabled: true},
      buttonAllowance: {name: 'Update Allowance', disabled: true},
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
        text: 'Please enter correct information'
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
        this.setMessage('danger', ['Please enter correct information']);
      else if (this.selectedType == this.$libre.loansType.Libre && this.allowed < this.amount) {
        this.setMessage('warning', [
          'When creating the offer, you will need to make two transactions:',
          `1. Authorize the transfer of ${this.amount} tokens`,
          '2. Create Offer Transaction'
        ]);
      } else
        this.setMessage('info', ['You can create an offer']);
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
      this.allowed = this.$libre.toToken(await this.$libre.token.allowance(this.myAddress, Config.loans.address[this.$eth.network]));
      try {
        this.balanceETH = +this.$eth.fromWei(await this.$eth.getBalance(this.myAddress));
      } catch (err) {
        this.balanceETH = err;
      }
      this.balanceLibre = this.$libre.toToken(await this.$libre.token.balanceOf(window.web3.eth.defaultAccount));
    },

    async approveToken() {
      try {
        this.setMessage('info', [
          'Please confirm sending of the transaction:',
          `1. Authorize the transfer of ${this.amount} tokens - waiting for confirmations...`,
          '2. Create Offer Transaction'
        ]);
        let txHash = await this.$libre.token.approve(Config.loans.address[this.$eth.network], this.$libre.fromToken(this.amount));
        this.setMessage('info', [
          'Please wait, there is a sending to the network:',
          `1. Authorize the transfer of ${this.amount} tokens - send to the network...`,
          '2. Create Offer Transaction'
        ]);
        if (await this.$eth.isSuccess(txHash)) {
          this.setMessage('success', [
            'The transaction was sent successfully:',
            `1. Authorize the transfer of ${this.amount} tokens - success`,
            '2. Create Offer Transaction'
          ]);
          await this.updateData()
        } else {
          this.$snackbar.open(`Authorize the transfer of ${this.amount} tokens - error`);
          this.setMessage('danger', [
            'The transaction ended with error:',
            `1. Authorize the transfer of ${this.amount} tokens - error`,
            '2. Create Offer Transaction'
          ]);
          return false
        }
      } catch(err) {
        console.log(err)
        this.$snackbar.open();
        this.setMessage('danger', [
          'The transaction ended with error:'
          `1. Authorize the transfer of ${this.amount} tokens - ${this.$eth.getErrorMsg(err)}`,
          '2. Create Offer Transaction'
        ]);
        return false
      }
      
      return true;
    },

    async createLoan() {
      let
        txHash,
        now = new Date(),
        debatingEnd = (new Date(this.debatingPeriod))
          .setHours(this.debatingTime.getHours(), this.debatingTime.getMinutes()),
        debatingPeriodInSeconds = Math.round((debatingEnd - now) / 1000);

      if (this.margin == '')
        this.margin = 0

      this.button = {name: 'Pending...', disabled: true}
      this.isLoadingButton = true

      try {
        switch(this.selectedType) {
          case this.$libre.loansType.Libre:
            console.log("createLoan",this.allowed, this.amount)
            if (this.allowed < this.amount && !(await this.approveToken())) {
              return
            }
            this.setMessage('info', [
              'Please confirm the sending of the transaction:',
              'Create Offer Transaction - wait confirm...'
            ]);
            txHash = await this.$libre.loans.giveLibre(
              debatingPeriodInSeconds,
              this.$libre.fromToken(+this.amount),
              this.$libre.fromToken(+this.margin)
            )
            this.setMessage('info', [
              'Please wait, there is a sending to the network:',
              'Create Offer Transaction - sending to the network...'
            ]);
            break;
          case this.$libre.loansType.ETH:
            this.setMessage('info', [
              'Please confirm the sending of the transaction:',
              'Create Offer Transaction - waiting for confirmations...'
            ])
            txHash = await this.$libre.loans.giveEth(
              debatingPeriodInSeconds,
              +this.$eth.toWei(this.amount, 'ether'),
              +this.$eth.toWei(this.margin, 'ether'),
              { value: +this.$eth.toWei(this.amount, 'ether') }
            )
            this.setMessage('info', [
              'Please wait, there is a sending to the network:',
              'Create Offer Transaction - sending to the network...'
            ])
            break;
        }

        if (await this.$eth.isSuccess(txHash)) {
          this.$router.push('/loans')
        } else {
          this.$snackbar.open('Creating offer error');
          this.setMessage('danger', [
            'The transaction ended with error:',
            'Create Offer Transaction'
          ]);
        }
      }
      catch(err) {
        this.$snackbar.open(this.$eth.getErrorMsg(err));
        this.setMessage('danger', [
          'The transaction ended with error: Create Offer Transaction',
          this.$eth.getErrorMsg(err)
        ]);
      }
      this.button = {name: 'Create Offer', disabled: false}
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