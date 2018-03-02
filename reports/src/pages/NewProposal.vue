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
        <b-field horizontal :label="selectedType['benef']" v-if="selectedType['benef']"
          :type="typeBenef">
            <b-input v-model="beneficiary" placeholder="0x0000000000000000000000000000000000000000"></b-input>
        </b-field>
        <b-field horizontal :label="selectedType['buf']" v-if="selectedType['buf']">
            <b-input v-model="buffer"></b-input>
        </b-field>
        <b-field horizontal :label="selectedType['amount']" v-if="selectedType['amount']">
            <b-input v-model="weiAmount"></b-input>
        </b-field>
        <b-field horizontal label="Description">
            <b-input type="textarea" v-model="description"></b-input>
        </b-field>
        <b-field horizontal label="Debating">
            <b-input v-model="debatingPeriodInMinutes"></b-input>
        </b-field>
        <b-field horizontal :label="selectedType['code']" v-if="selectedType['code']">
            <b-input type="textarea" v-model="transactionBytecode"></b-input>
        </b-field>
        <b-field horizontal>
            <p class="control">
                <button class="button is-primary" v-on:click="createProposal()">
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
      typeBenef: 'is-danger',
      weiAmount: '',
      description: '',
      debatingPeriodInMinutes: '',
      transactionBytecode: '',
      buffer: '',
      typeProposals: [
        //{text: 'Clean', key: 'CLEAN', fields:[]}, // 
        {text: 'Universal', key: 'UNIVERSAL', benef:'Beneficiary',amount:'Amound Wei',code:'Bytecode'},
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
        {text: 'Winthdraw balance', value: 'WITHDRAW_BALANCE'}
      ],
      selectedType: {text: 'Select a type proposal', fields: []}
    }
  },
  methods: {
    setType() {
      console.log(this.selectTypeProposal)
    },
    async createProposal() {
      console.log("Create proposal",this.selectedType)

      switch(this.selectedType.key) {
        //case 'CLEAN': break;
        case 'UNIVERSAL':
          await this.$eth._daoContract.proposalUniversal(
            this.beneficiary, 
            this.weiAmount,
            this.description,
            this.debatingPeriodInMinutes,
            this.transactionBytecode)
          break;
        case 'TRANSFER_OWNERSHIP':
          await this.$eth._daoContract.proposalTransferOwnership(
            this.beneficiary, 
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'SET_BUY_LIMITS':
          await this.$eth._daoContract.proposalSetBuyLimits(
            this.weiAmount,
            this.buffer,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'SET_SELL_LIMITS':
          await this.$eth._daoContract.proposalSetSellLimits(
            this.weiAmount,
            this.buffer,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'CANCEL_BUY_ORDER':
          await this.$eth._daoContract.proposalCancelBuyOrder(
            this.weiAmount,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'CANCEL_SELL_ORDER':
          await this.$eth._daoContract.proposalCancelSellOrder(
            this.weiAmount,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'ATTACH_TOKEN':
          await this.$eth._daoContract.proposalAttachToken(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'SET_BANK_ADDRESS':
          await this.$eth._daoContract.proposalBankAddress(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'RELEVANCE_PERIOD':
          await this.$eth._daoContract.proposalRelevancePeriod(
            this.weiAmount,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'QUEUE_PERIOD':
          await this.$eth._daoContract.proposalQueuePeriod(
            this.weiAmount,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'SET_FEES':
          await this.$eth._daoContract.proposalFees(
            this.weiAmount,
            this.buffer,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'ADD_ORACLE':
          await this.$eth._daoContract.proposalAddOracle(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'DISABLE_ORACLE':
          await this.$eth._daoContract.proposalDisableOracle(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'ENABLE_ORACLE':
          await this.$eth._daoContract.proposalEnableOracle(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'DELETE_ORACLE':
          await this.$eth._daoContract.proposalDeleteOracle(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'SET_SCHEDULER':
          await this.$eth._daoContract.proposalScheduler(
            this.beneficiary,
            this.description,
            this.debatingPeriodInMinutes)
          break;
        case 'WITHDRAW_BALANCE':
          await this.$eth._daoContract.proposalWithdrawBalance(
            this.description,
            this.debatingPeriodInMinutes)
          break;
      }
    }
  },
  created () {
    try {
      console.log("Hello");
    } catch (err) {
      console.log(err)
    }
  },
  components: {
  }
}
</script>