<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO New Proposal</h2>
      </div>
      <br>
      <div class="table-padding" >
        <button @click="$router.go(-1)" :to="{ path: '/loans' }" class="button">
          <b-icon icon="keyboard-return" size="is-small"></b-icon>
          <span>Back</span>
        </button><br><br>
        <b-field horizontal label="Type" >
          <b-select placeholder="Select a type proposal" v-model="selectedType">
              <option v-for="type in typeProposals" v-bind:value="type">
                {{ type.text }}
              </option>
          </b-select>
        </b-field>
        <b-field horizontal :label="selectedType['benef']" v-if="selectedType['benef']" :type="isAddress(beneficiary) ? '' : 'is-danger'">
            <b-input v-model="beneficiary" placeholder="0x0000000000000000000000000000000000000000"></b-input>
        </b-field>
        <b-field horizontal :label="selectedType['buf']" v-if="selectedType['buf']" :type="isInteger(buffer) ? '' : 'is-danger'">
            <b-input v-model="buffer" placeholder="0"></b-input>
        </b-field>
        <b-field horizontal :label="selectedType['amount']" v-if="selectedType['amount']" :type="isInteger(amount) ? '' : 'is-danger'">
            <b-input v-model="amount" placeholder="0"></b-input>
        </b-field>
        <b-field horizontal :label="selectedType['lock']" v-if="selectedType['lock']">
          <b-select v-model="lock">
            <option>true</option>
            <option>false</option>
          </b-select>
        </b-field>
        <b-field horizontal label="Description:">
            <b-input type="textarea" v-model="description"></b-input>
        </b-field>
        <b-field horizontal label="Debating period:" :type="isDebatingPeriod() ? '' : 'is-danger'">
            <b-datepicker placeholder="Click to select..." v-model="debatingPeriod" icon="calendar-today"></b-datepicker>
            <b-timepicker placeholder="Set time..." icon="clock" v-model="debatingTime"></b-timepicker>
        </b-field>
        <b-field horizontal :label="selectedType['code']" v-if="selectedType['code']" >
            <b-field :message="bytecodeMessage" :type="isByteCode(transactionBytecode) ? 'is-success' : 'is-danger'">
                <b-input type="textarea" v-model="transactionBytecode" placeholder="0"></b-input>
            </b-field>
        </b-field>
        <b-field horizontal>
            <p class="control">
                <button v-bind:class="{'button is-primary':true, 'is-loading':button.isLoading}" v-on:click="createProposal()" :disabled="button.disabled">
                  Create Proposal
                </button>
            </p>
        </b-field>
      </div>
      <br>
    </section>
    </div>

</template>

<script>
import Config from '@/config'
export default {
  data () {
    return {
      proposalData: [],
      daoAddress: '',
      beneficiary: '',
      amount: '',
      description: '',
      debatingPeriod: new Date(),
      debatingTime: new Date(),
      transactionBytecode: '',
      buffer: '',
      lock: false,
      typeProposals: this.$libre.typeProposals,
      selectedType: '',
      bytecodeMessage: '',
      button: {
        isLoading: false,
        disabled: true
      }
    }
  },
  methods: {
    isAddress (address) {
      return web3.isAddress(address)
    },

    isByteCode(code) {
      return /^0x[0-9a-fA-F]*$/.test(code)
    },

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
      // Refactor it. 
      if (this.selectedType['benef'] && !this.isAddress(this.beneficiary))
        valid = false
      else if (this.selectedType['amount'] && !this.isInteger(this.amount))
        valid = false
      else if (this.selectedType['buf'] && !this.isInteger(this.buffer))
        valid = false
      else if (this.selectedType['code'] && !this.isByteCode(this.transactionBytecode))
        valid = false
      else if (!this.isDebatingPeriod())
        valid = false

      this.button.disabled = !valid
    },

    async createProposal() {
      let 
        txHash,
        now = new Date(),
        debatingEnd = (new Date(this.debatingPeriod))
          .setHours(this.debatingTime.getHours(),this.debatingTime.getMinutes()),
        debatingPeriod = Math.round((debatingEnd - now) / 1000),
        indexTP = this.$libre.typeProposals.indexOf(this.selectedType),
        amount = this.amount,
        buffer = this.buffer;

      this.button.isLoading = true

      try {
        switch(this.selectedType.key) {
          case 'SET_FEES':
            amount *= 100;
            buffer *= 100;
            break;
          case 'SET_ORACLE_TIMEOUT':
          case 'SET_ORACLE_ACTUAL':
          case 'SET_RATE_PERIOD':
            amount *= 60;
            break;
          case 'SET_LOCK':
            amount = this.lock === 'true' ? 1 : 0;
            break;
        }

        txHash = await this.$libre.dao.newProposal(
          indexTP,
          this.beneficiary,
          amount,
          buffer,
          this.description,
          debatingPeriod,
          this.transactionBytecode)

        if (await this.$eth.isSuccess(txHash)) {
          this.$router.push('/dao')
        } else {
          this.$snackbar.open('Creating proposal error');
        }
      }
      catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$snackbar.open(msg);
      }

      this.button.isLoading = false
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.daoAddress = Config.dao.address;
      this.selectedType = this.typeProposals[0]
    } catch (err) {
      console.log(err)
    }
  },
  watch: {
    beneficiary: function() {this.validData()},
    amount: function() {this.validData()},
    debatingPeriod: function() {this.validData()},
    debatingTime: function() {this.validData()},
    transactionBytecode: function() {
      this.bytecodeMessage = this.$libre.bytecodeToString(this.beneficiary,this.transactionBytecode)
      this.validData()
    },
    buffer: function() {this.validData()},
    selectedType: function() {
      this.beneficiary = this.amount = this.transactionBytecode = this.buffer = '';
      this.debatingPeriod = this.debatingTime = new Date();
    }
  }
}
</script>