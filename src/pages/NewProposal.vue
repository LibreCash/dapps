<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO New Proposal</h2>
      </div>
      <br>
      <div class="table-padding" >
        <div>Token count: {{ tokensCount }} LBRS</div>
        <div>Min token count to create: {{ $libre.proposalParams.minBalance / 10 ** 18 }} LBRS</div>
        <div>Min deadline period in seconds: {{ $libre.proposalParams.minTime }}</div>
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
        <b-field horizontal :label="selectedType['code']" v-if="selectedType['code']" :type="isByteCode(transactionBytecode) ? 'is-success' : 'is-danger'">
            <b-input type="textarea" v-model="transactionBytecode" placeholder="0"></b-input>
        </b-field>
        <b-field horizontal>
            <p class="control">
                <button class="button is-primary" v-on:click="createProposal()"
                    :disabled="button.disabled || tokensCount < $libre.proposalParams.minBalance / Math.pow(10, 18)">
                  {{ button.name }}
                </button>
                <b-tag v-if="tokensCount < $libre.proposalParams.minBalance / Math.pow(10, 18)">not enough tokens to create proposal</b-tag>
                <b-tag v-if="!validPeriod">too short debating period (min {{ $libre.proposalParams.minTime / 60 / 60 }} hours)</b-tag>
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
      defaultAddress: '',
      tokensCount: '',
      debatingPeriod: new Date(),
      debatingTime: new Date(),
      transactionBytecode: '',
      buffer: '',
      lock: false,
      button: {name: 'Create Proposal', disabled: true},
      typeProposals: this.$libre.typeProposals,
      selectedType: '',
      validPeriod: true
    }
  },
  methods: {
    async getTokensCount () {
      await this.$libre.promiseLibre;
      this.tokensCount = +await this.$libre.liberty.balanceOf(this.defaultAddress) / 10 ** this.$libre.consts.DECIMALS;
    },

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
      let 
        now = Date.now(),
        debatingEnd = new Date(this.debatingPeriod)
      // Refactor it  
      debatingEnd.setHours(this.debatingTime.getHours(), this.debatingTime.getMinutes())
      return (debatingEnd - now) > this.$libre.proposalParams.minTime * 1000 + 10 * 1000 /* milliseconds */;
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
        debatingPeriod = Math.round((debatingEnd - now) / 1000);

      this.button = {name: 'Pending...', disabled: true}

      try {
        switch(this.selectedType.key) {
          //case 'CLEAN': break;
          case 'UNIVERSAL':
            txHash = await this.$libre.dao.prUniversal(
              this.beneficiary, 
              this.amount,
              this.description,
              debatingPeriod,
              this.transactionBytecode)
            break;
          case 'TRANSFER_OWNERSHIP':
            txHash = await this.$libre.dao.prTransferOwnership(
              this.beneficiary, 
              this.description,
              debatingPeriod)
            break;
          case 'ATTACH_TOKEN':
            txHash = await this.$libre.dao.prAttachToken(
              this.beneficiary,
              this.description,
              debatingPeriod)
            break;
          case 'SET_BANK_ADDRESS':
            txHash = await this.$libre.dao.prBankAddress(
              this.beneficiary,
              this.description,
              debatingPeriod)
            break;
          case 'SET_FEES':
            txHash = await this.$libre.dao.prFees(
              this.amount * 100,
              this.buffer * 100,
              this.description,
              debatingPeriod)
            break;
          case 'ADD_ORACLE':
            txHash = await this.$libre.dao.prAddOracle(
              this.beneficiary,
              this.description,
              debatingPeriod)
            break;
          case 'DISABLE_ORACLE':
            txHash = await this.$libre.dao.prDisableOracle(
              this.beneficiary,
              this.description,
              debatingPeriod)
            break;
          case 'ENABLE_ORACLE':
            txHash = await this.$libre.dao.prEnableOracle(
              this.beneficiary,
              this.description,
              debatingPeriod)
            break;
          case 'DELETE_ORACLE':
            txHash = await this.$libre.dao.prDeleteOracle(
              this.beneficiary,
              this.description,
              debatingPeriod)
            break;
          case 'SET_SCHEDULER':
            txHash = await this.$libre.dao.prScheduler(
              this.beneficiary,
              this.description,
              debatingPeriod)
            break;
          case 'WITHDRAW_BALANCE':
            txHash = await this.$libre.dao.prWithdrawBalance(
              this.description,
              debatingPeriod)
            break;
          case 'SET_ORACLE_TIMEOUT':
            txHash = await this.$libre.dao.prOracleTimeout(
              this.amount * 60,
              this.description,
              debatingPeriod)
            break;
          case 'SET_ORACLE_ACTUAL':
            txHash = await this.$libre.dao.prOracleActual(
              this.amount * 60,
              this.description,
              debatingPeriod)
            break;
          case 'SET_RATE_PERIOD':
            txHash = await this.$libre.dao.prRatePeriod(
              this.amount * 60,
              this.description,
              debatingPeriod)
            break;
          case 'SET_LOCK':
            txHash = await this.$libre.dao.prPause(
              this.lock === 'true' ? 1 : 0,
              this.description,
              debatingPeriod)
            break;
          case 'CLAIM_OWNERSHIP':
            txHash = await this.$libre.dao.prClaimOwnership(
              this.description,
              debatingPeriod)
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
    },
    startValidDataTimer () {
      this.validDataTimer = setInterval(() => {
        this.validPeriod = this.isDebatingPeriod();
        this.validData();
      }, 2000)
    },
    endValidDataTimer () {
      clearInterval(this.validDataTimer);
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.defaultAddress = window.web3.eth.defaultAccount;
      this.daoAddress = Config.dao.address;
      this.selectedType = this.typeProposals[0];
      this.getTokensCount();
      this.startValidDataTimer();
    } catch (err) {
      console.log(err)
    }
  },
  async destroyed () {
    this.endValidDataTimer();
  },
  watch: {
    beneficiary: function() {this.validData()},
    amount: function() {this.validData()},
    debatingPeriod: function() {this.validData()},
    debatingTime: function() {this.validData()},
    transactionBytecode: function() {this.validData()},
    buffer: function() {this.validData()},
    selectedType: function() {
      this.beneficiary = this.amount = this.transactionBytecode = this.buffer = '';
      this.debatingPeriod = this.debatingTime = new Date();
    }
  }
}
</script>