<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">New Loan Offer</h2>
      </div>
      <br>
      <div class="table-padding" >
        <b-field horizontal label="Type" >
          <b-select placeholder="Select loan offer type" v-model="selectedType">
              <option v-for="(key, type) in typeLoans" v-bind:value="key">
                {{ type }}
              </option>
          </b-select>
        </b-field>
        <b-field horizontal :label="'Amount, ' + Object.keys(typeLoans)[selectedType]" :type="isInteger(amount) ? '' : 'is-danger'">
            <b-input v-model="amount" placeholder="0"></b-input>
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
      <br>
    </section>
    </div>

</template>

<script>
export default {
  data () {
    return {
      proposalData: [],
      daoAddress: this.$eth.daoAddress,
      recipient: '',
      amount: '',
      margin: '',
      debatingPeriod: new Date(),
      debatingTime: new Date(),
      button: {name: 'Create Offer', disabled: true},
      typeLoans: this.$libre.loansType,
      selectedType: 0
    }
  },
  methods: {
    isInteger(number) {
      return +number >= 0
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

      if (!this.isInteger(this.amount))
        valid = false
      else if (!this.isInteger(this.margin))
        valid = false
      else if (!this.isDebatingPeriod())
        valid = false

      this.button.disabled = !valid
    },

    async createLoan() {
      let
        txHash,
        now = new Date(),
        debatingEnd = (new Date(this.debatingPeriod))
          .setHours(this.debatingTime.getHours(),this.debatingTime.getMinutes()),
        debatingPeriodInMinutes = Math.round((debatingEnd - now) / 1000 / 60);

      this.button = {name: 'Pending...', disabled: true}

      try {
        switch(this.selectedType) {
          case 0 /* Libre */:
            txHash = await this.$eth.loansContract.giveLibre(
              debatingPeriodInMinutes,
              this.amount * 10 ** 18,
              this.margin
            )
            break;
          case 1 /* ETH */:
            txHash = await this.$eth.loansContract.giveEth(
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
  created () {
    try {

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
      this.recipient = this.amount = this.margin = '';
      this.debatingPeriod = this.debatingTime = new Date();
    }
  }
}
</script>