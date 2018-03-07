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
export default {
  data () {
    return {
      proposalData: [],
      daoAddress: this.$eth.daoAddress,
      beneficiary: '',
      weiAmount: '',
      description: '',
      debatingPeriod: new Date(),
      debatingTime: new Date(),
      transactionBytecode: '',
      buffer: '',
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
      let now = new Date();

      if (this.debatingEnd)
        return false;
      
      let debatingEnd = new Date(this.debatingPeriod);
      debatingEnd.setHours(this.debatingTime.getHours(),this.debatingTime.getMinutes())

      return (debatingEnd - now) > 0
    },

    validData() {
      let valid = true

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
      let txHash,
          now = new Date(),
          debatingEnd = (new Date(this.debatingPeriod))
          .setHours(this.debatingTime.getHours(),this.debatingTime.getMinutes()),
          debatingPeriodInMinutes = Math.round((debatingEnd - now) / 1000 / 60);

      switch(this.selectedType.key) {
        //case 'CLEAN': break;
        case 'UNIVERSAL':
          txHash = await this.$eth.daoContract.proposalUniversal(
            this.beneficiary, 
            this.weiAmount,
            this.description,
            debatingPeriodInMinutes,
            this.transactionBytecode)
          break;
        case 'TRANSFER_OWNERSHIP':
          txHash = await this.$eth.daoContract.proposalTransferOwnership(
            this.beneficiary, 
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'SET_BUY_LIMITS':
          txHash = await this.$eth.daoContract.proposalSetBuyLimits(
            this.weiAmount,
            this.buffer,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'SET_SELL_LIMITS':
          txHash = await this.$eth.daoContract.proposalSetSellLimits(
            this.weiAmount,
            this.buffer,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'CANCEL_BUY_ORDER':
          txHash = await this.$eth.daoContract.proposalCancelBuyOrder(
            this.weiAmount,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'CANCEL_SELL_ORDER':
          txHash = await this.$eth.daoContract.proposalCancelSellOrder(
            this.weiAmount,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'ATTACH_TOKEN':
          txHash = await this.$eth.daoContract.proposalAttachToken(
            this.beneficiary,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'SET_BANK_ADDRESS':
          txHash = await this.$eth.daoContract.proposalBankAddress(
            this.beneficiary,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'RELEVANCE_PERIOD':
          txHash = await this.$eth.daoContract.proposalRelevancePeriod(
            this.weiAmount,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'QUEUE_PERIOD':
          txHash = await this.$eth.daoContract.proposalQueuePeriod(
            this.weiAmount,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'SET_FEES':
          txHash = await this.$eth.daoContract.proposalFees(
            this.weiAmount,
            this.buffer,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'ADD_ORACLE':
          txHash = await this.$eth.daoContract.proposalAddOracle(
            this.beneficiary,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'DISABLE_ORACLE':
          txHash = await this.$eth.daoContract.proposalDisableOracle(
            this.beneficiary,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'ENABLE_ORACLE':
          txHash = await this.$eth.daoContract.proposalEnableOracle(
            this.beneficiary,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'DELETE_ORACLE':
          txHash = await this.$eth.daoContract.proposalDeleteOracle(
            this.beneficiary,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'SET_SCHEDULER':
          txHash = await this.$eth.daoContract.proposalScheduler(
            this.beneficiary,
            this.description,
            debatingPeriodInMinutes)
          break;
        case 'WITHDRAW_BALANCE':
          txHash = await this.$eth.daoContract.proposalWithdrawBalance(
            this.description,
            debatingPeriodInMinutes)
          break;
      }

      this.button = {name: 'Pending...', disabled: true}
      try {
        console.log(txHash)
        await this.$eth.getReceipt(txHash)
        this.$router.push('/dao')
      }
      catch(e) {
        console.log(e);
        this.button = {name: 'Create Proposal', disabled: true}
      }
    }
  },
  created () {
    try {
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