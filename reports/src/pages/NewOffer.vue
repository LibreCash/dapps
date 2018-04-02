<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">New Loan Offer</h2>
      </div>
      <br>
      <div class="table-padding">
        <p>My address: {{ myAddress }}</p>
        <p>Allowed: {{ allowed }} Libre</p>
        <p>ETH Balance: {{ balanceETH }} ETH</p>
        <p>Libre Balance: {{ balanceLibre }} Libre</p>
        <b-modal :active.sync="isOpen" has-modal-card>
          <allowance-modal v-bind="approve"></allowance-modal>
        </b-modal>
        <button class="button is-primary" v-on:click="isOpen = true">Allowance</button>
      </div>
      <div class="table-padding">
        <b-collapse class="card" :open.sync="isOfferOpen">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">New Offer</p>
            <a class="card-header-icon">
              <b-icon :icon="isOpen ? 'menu-up' : 'menu-down'"></b-icon>
            </a>
          </div>
          <div class="card-content">
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
                <button class="button is-primary" @click="allAvailable()" v-if="selectedType == 0">All available</button>
              </p>
            </b-field>
            <b-field horizontal label="Margin" :type="isInteger(margin) ? '' : 'is-danger'">
              <b-input v-model="margin" placeholder="0"></b-input>
            </b-field>
            <b-field horizontal label="Offer period:" :type="isDebatingPeriod() ? '' : 'is-danger'">
              <b-datepicker placeholder="Click to select..." v-model="debatingPeriod" icon="calendar-today"></b-datepicker>
              <b-timepicker placeholder="Set time..." icon="clock" v-model="debatingTime"></b-timepicker>
            </b-field>
            <b-field horizontal>
              <p class="control">
                <button class="button is-primary" v-on:click="createLoan()" v-model="button" :disabled="button.disabled">
                  {{ button.name }}
                </button>
              </p>
            </b-field>
          </div>
        </b-collapse>
      </div>
      <br>
    </section>
    </div>

</template>

<script>
import Config from '@/config'
import AllowanceModal from '@/components/AllowanceModal'
export default {
  data () {
    return {
      proposalData: [],
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
      newAllowance: 0,
      isOpen: false,
      isOfferOpen: true,
      approve: {
        address: Config.loans.address,
        callback: this.updateData
      }
    }
  },
  methods: {
    isInteger(number) {
      return +number >= 0
    },

    isValidAmount(number) {
      return this.isInteger(number) && number > 0 && (
        (this.selectedType == 0 /* Libre */ && number <= this.balanceLibre && number <= this.allowed) ||
        (this.selectedType == 1 /* ETH */ && number < this.balanceETH) /* '<' not '<=' cause tx fee */
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
    },

    validAllowanceData() {
      let valid = true

      if (!this.isInteger(this.newAllowance))
        valid = false

      this.buttonAllowance.disabled = !valid
    },

    async allAvailable() {
      if (this.selectedType == 1 /* ETH */) {
        this.amount = this.balanceETH;
      } else {
        this.amount = Math.min(this.balanceLibre, this.allowed);
      }
    },

    async updateData() {
      this.myAddress = window.web3.eth.defaultAccount;
      this.allowed = +await this.$libre.token.allowance(this.myAddress, Config.loans.address) / 10**18;
      try {
        this.balanceETH = +this.$eth.fromWei(await this.$eth.getBalance(this.myAddress));
      } catch (err) {
        this.balanceETH = err;
      }
      this.balanceLibre = +await this.$libre.token.balanceOf(window.web3.eth.defaultAccount) / 10 ** 18;
    },

    async createLoan() {
      let
        txHash,
        now = new Date(),
        debatingEnd = (new Date(this.debatingPeriod))
          .setHours(this.debatingTime.getHours(), this.debatingTime.getMinutes()),
        debatingPeriodInMinutes = Math.round((debatingEnd - now) / 1000 / 60);

      this.button = {name: 'Pending...', disabled: true}

      try {
        switch(this.selectedType) {
          case 0 /* Libre */:
            txHash = await this.$libre.loans.giveLibre(
              debatingPeriodInMinutes,
              this.amount * 10 ** 18,
              this.margin
            )
            break;
          case 1 /* ETH */:
            txHash = await this.$libre.loans.giveEth(
              debatingPeriodInMinutes,
              +this.$eth.toWei(this.amount, 'ether'),
              this.margin,
              { value: +this.$eth.toWei(this.amount, 'ether') }
            )
            break;
        }

        if (await this.$eth.isSuccess(txHash)) {
          this.$router.push('/loans')
        } else {
          alert('Creating offer error')
        }
      }
      catch(err) {
        alert(this.$eth.getErrorMsg(err))
        this.button = {name: 'Create Offer', disabled: true}
      }
    }
  },
  async created () {
    try {
      await this.$eth.loadAccounts();
      await this.$libre.init();
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
    newAllowance: function() {this.validAllowanceData()},
    selectedType: function() {
      this.amount = this.margin = '';
    }
  },
  components: {
    AllowanceModal
  }
}
</script>