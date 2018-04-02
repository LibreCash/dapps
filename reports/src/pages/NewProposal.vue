<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO New Proposal</h2>
      </div>
      <br>
      <div class="table-padding" >
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
        <b-field horizontal :label="selectedType['amount']" v-if="selectedType['amount']" :type="isInteger(weiAmount) ? '' : 'is-danger'">
            <b-input v-model="weiAmount" placeholder="0"></b-input>
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
        <b-field horizontal :label="selectedType['code']" v-if="selectedType['code']" :type="isByteCode(transactionBytecode) ? 'is-success' : 'is-danger'">
            <b-input type="textarea" v-model="transactionBytecode" placeholder="0"></b-input>
        </b-field>
        <b-field horizontal>
            <p class="control">
                <button class="button is-primary" v-on:click="createProposal()" v-model="button" :disabled="button.disabled">
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
import Config from '@/config'
export default {
  data () {
    return {
      proposalData: [],
      daoAddress: '',
      beneficiary: '',
      weiAmount: '',
      description: '',
      debatingPeriod: new Date(),
      debatingTime: new Date(),
      transactionBytecode: '',
      buffer: '',
      lock: false,
      button: {name: 'Create Proposal', disabled: true},
      typeProposals: this.$libre.typeProposals.slice(1),
      selectedType: ''
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
      else if (this.selectedType['amount'] && !this.isInteger(this.weiAmount))
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
        debatingPeriodInMinutes = Math.round((debatingEnd - now) / 1000 / 60);

      this.button = {name: 'Pending...', disabled: true}

      try {
        switch(this.selectedType.key) {
          //case 'CLEAN': break;
          case 'UNIVERSAL':
            txHash = await this.$libre.dao.prUniversal(
              this.beneficiary, 
              this.weiAmount,
              this.description,
              debatingPeriodInMinutes,
              this.transactionBytecode)
            break;
          case 'TRANSFER_OWNERSHIP':
            txHash = await this.$libre.dao.prTransferOwnership(
              this.beneficiary, 
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'ATTACH_TOKEN':
            txHash = await this.$libre.dao.prAttachToken(
              this.beneficiary,
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'SET_BANK_ADDRESS':
            txHash = await this.$libre.dao.prBankAddress(
              this.beneficiary,
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'SET_FEES':
            txHash = await this.$libre.dao.prFees(
              this.weiAmount,
              this.buffer,
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'ADD_ORACLE':
            txHash = await this.$libre.dao.prAddOracle(
              this.beneficiary,
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'DISABLE_ORACLE':
            txHash = await this.$libre.dao.prDisableOracle(
              this.beneficiary,
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'ENABLE_ORACLE':
            txHash = await this.$libre.dao.prEnableOracle(
              this.beneficiary,
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'DELETE_ORACLE':
            txHash = await this.$libre.dao.prDeleteOracle(
              this.beneficiary,
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'SET_SCHEDULER':
            txHash = await this.$libre.dao.prScheduler(
              this.beneficiary,
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'WITHDRAW_BALANCE':
            txHash = await this.$libre.dao.prWithdrawBalance(
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'SET_ORACLE_TIMEOUT':
            txHash = await this.$libre.dao.prOracleTimeout(
              this.amount,
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'SET_ORACLE_ACTUAL':
            txHash = await this.$libre.dao.prOracleActual(
              this.amount,
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'SET_RATE_PERIOD':
            txHash = await this.$libre.dao.prRatePeriod(
              this.amount,
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'SET_LOCK':
            txHash = await this.$libre.dao.prPause(
              this.lock === 'true' ? 1 : 0,
              this.description,
              debatingPeriodInMinutes)
            break;
          case 'CLAIM_OWNERSHIP':
            txHash = await this.$libre.dao.prClaimOwnership(
              this.description,
              debatingPeriodInMinutes)
            break;
        }

        if (await this.$eth.isSuccess(txHash)) {
          this.$router.push('/dao')
        } else {
          alert('Creating proposal error')
        }
      }
      catch(err) {
        alert(this.$eth.getErrorMsg(err))
        this.button = {name: 'Create Proposal', disabled: true}
      }
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
    weiAmount: function() {this.validData()},
    debatingPeriod: function() {this.validData()},
    debatingTime: function() {this.validData()},
    transactionBytecode: function() {this.validData()},
    buffer: function() {this.validData()},
    selectedType: function() {
      this.beneficiary = this.weiAmount = this.transactionBytecode = this.buffer = '';
      this.debatingPeriod = this.debatingTime = new Date();
    }
  }
}
</script>