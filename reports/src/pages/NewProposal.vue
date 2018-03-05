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
        <b-field horizontal label="Description">
            <b-input type="textarea" v-model="description"></b-input>
        </b-field>
        <b-field horizontal label="Debating (in sec.)" :type="isInteger(debatingPeriodInMinutes) ? '' : 'is-danger'">
            <b-input v-model="debatingPeriodInMinutes" placeholder="0"></b-input>
        </b-field>
        <b-field horizontal :label="selectedType['code']" v-if="selectedType['code']" :type="isByteCode(transactionBytecode) ? 'is-success' : 'is-danger'">
            <b-input type="textarea" v-model="transactionBytecode" placeholder="0"></b-input>
        </b-field>
        <b-field horizontal>
            <p class="control">
                <button class="button is-primary" v-on:click="createProposal()" :disabled="disButton">
                  Create Proposal
                </button>
            </p>
        </b-field>
      </div>
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
      debatingPeriodInMinutes:'',
      transactionBytecode: '',
      buffer: '',
      disButton: true,
      typeProposals: [
        //{text: 'Clean', key: 'CLEAN', fields:[]}, // 
        {text: 'Universal', key: 'UNIVERSAL', benef:'Beneficiary',amount:'Amount Wei',code:'Bytecode'},
        {text: 'Transfer ownership', key: 'TRANSFER_OWNERSHIP', benef:'New Owner'},
        {text: 'Set buy limits', key:'SET_BUY_LIMITS', amount:'Min Buy In Wei',buf:'Max Buy In Wei'},
        {text: 'Set sell limits', key:'SET_SELL_LIMITS', amount:'Min Sell In Wei',buf:'Max Sell In Wei'},
        {text: 'Cancel buy order', key:'CANCEL_BUY_ORDER', amount:'Order ID'},
        {text: 'cancel sell order', key: 'CANCEL_SELL_ORDER', amount:'Order ID'},
        {text: 'Attach token', key: 'ATTACH_TOKEN', benef:'Token Address'},
        {text: 'Set bank address', key:'SET_BANK_ADDRESS', benef:'Bank Address'},
        {text: 'Set relevance period', key: 'RELEVANCE_PERIOD', amount:'Period in seconds'},
        {text: 'Set queue period', key: 'QUEUE_PERIOD', amount:'Period in seconds'},
        {text: 'Set fees', key: 'SET_FEES', amount:'Buy fee', buf: 'Sell fee'},
        {text: 'Add oracle', key: 'ADD_ORACLE', benef:'Oracle Address'},
        {text: 'Disable oracle', key: 'DISABLE_ORACLE', benef:'Oracle Address'},
        {text: 'Enable oracle', key: 'ENABLE_ORACLE', benef:'Oracle Address'},
        {text: 'Delete oracle', key: 'DELETE_ORACLE', benef:'Oracle Address'},
        {text: 'Set scheduler', key: 'SET_SCHEDULER', benef:'Scheduler Address'},
        {text: 'Winthdraw balance', key: 'WITHDRAW_BALANCE'}
      ],
      selectedType: ''
    }
  },
  methods: {
    isAddress (address) {
      return (address.length == 42) && (/^0x[0-9a-zA-Z]*$/.test(address))
    },

    isByteCode(code) {
      return /^0x[0-9a-zA-Z]*$/.test(code)
    },

    isInteger(number) {
      return +number >= 0
    },

    validData() {
      let valid = true

      if (selectedType['benef'] && !isAddress(beneficiary))
        valid = false
      else if (selectedType['amount'] && !isInteger(weiAmount))
        valid = false
      else if (selectedType['buf'] && !isInteger(buffer))
        valid = false
      else if (selectedType['code'] && !isByteCode(transactionBytecode))
        valid = false

      this.disButton = valid
    },

    async createProposal() {
      switch(this.selectedType.key) {
        //case 'CLEAN': break;
        case 'UNIVERSAL':
          await this.$eth.daoContract.proposalUniversal(
            this.beneficiary, 
            this.weiAmount,
            this.description,
            this.debatingPeriodInMinutes,
            this.transactionBytecode)
          break;
        case 'TRANSFER_OWNERSHIP':
          await this.$eth.daoContract.proposalTransferOwnership(
            this.beneficiary, 
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'SET_BUY_LIMITS':
          await this.$eth.daoContract.proposalSetBuyLimits(
            this.weiAmount,
            this.buffer,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'SET_SELL_LIMITS':
          await this.$eth.daoContract.proposalSetSellLimits(
            this.weiAmount,
            this.buffer,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'CANCEL_BUY_ORDER':
          await this.$eth.daoContract.proposalCancelBuyOrder(
            this.weiAmount,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'CANCEL_SELL_ORDER':
          await this.$eth.daoContract.proposalCancelSellOrder(
            this.weiAmount,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'ATTACH_TOKEN':
          await this.$eth.daoContract.proposalAttachToken(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'SET_BANK_ADDRESS':
          await this.$eth.daoContract.proposalBankAddress(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'RELEVANCE_PERIOD':
          await this.$eth.daoContract.proposalRelevancePeriod(
            this.weiAmount,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'QUEUE_PERIOD':
          await this.$eth.daoContract.proposalQueuePeriod(
            this.weiAmount,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'SET_FEES':
          await this.$eth.daoContract.proposalFees(
            this.weiAmount,
            this.buffer,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'ADD_ORACLE':
          await this.$eth.daoContract.proposalAddOracle(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'DISABLE_ORACLE':
          await this.$eth.daoContract.proposalDisableOracle(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'ENABLE_ORACLE':
          await this.$eth.daoContract.proposalEnableOracle(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'DELETE_ORACLE':
          await this.$eth.daoContract.proposalDeleteOracle(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'SET_SCHEDULER':
          await this.$eth.daoContract.proposalScheduler(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'WITHDRAW_BALANCE':
          this.$eth.daoContract.proposalWithdrawBalance(
            this.description,
            this.debatingPeriodInMinutes)
          break;
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
    debatingPeriodInMinutes: function() {this.validData()},
    transactionBytecode: function() {this.validData()},
    buffer: function() {this.validData()},
    selectedType: function() {
      this.beneficiary = this.weiAmount = this.debatingPeriodInMinutes = 
      this.transactionBytecode = this.buffer = ''
    }
  }
}
</script>