<template>
    <div>
      <div class="table-padding">
        <div class="card">
          <div class="card-content">
            <div>{{ $t('lang.common.token-count') }}: {{ tokensCount }} LBRS</div>
            <div>{{ $t('lang.dao.min-to-vote') }}: {{ $libre.proposalParams.minBalance / 10 ** 18 }} LBRS</div>
            <div>{{ $t('lang.dao.min-deadline') }}: {{ $libre.proposalParams.minTime }}</div>
            <router-link :to="{ path: '/dao' }" class="button">
                <div class="icon">
                  <i class="fas fa-arrow-left" size="is-small"></i>
                </div>
                <div>{{ $t('lang.common.back') }}</div>
            </router-link>
          </div>
        </div>
        <p>&nbsp;</p>
        <b-field horizontal :label="$t('lang.common.type')" >
          <b-select :placeholder="$t('lang.dao.select-type')" v-model="selectedType">
              <option v-for="type in typeProposals" v-bind:value="type">
                {{ type.text }}
              </option>
          </b-select>
        </b-field>
        <b-field horizontal v-if="selectedType['info']" :label="$t('lang.common.information')">
          {{ selectedType['info'] }}
        </b-field>
        <b-field horizontal :label="selectedType['benef']" v-if="selectedType['benef']">
            <b-field :type="getType(validBenef)">
                <b-input 
                    v-model="beneficiary" 
                    placeholder="0x0000000000000000000000000000000000000000">
                </b-input>
            </b-field>
        </b-field>
        <b-field horizontal :label="selectedType['buf']" v-if="selectedType['buf']" >
            <b-field :type="getType(validBuf)">
                <b-input v-model="buffer" placeholder="0"></b-input>
            </b-field>
        </b-field>
        <b-field horizontal :label="selectedType['amount']" v-if="selectedType['amount']">
            <b-field :type="getType(validAmount)">
                <b-input v-model="amount" placeholder="0"></b-input>
            </b-field>
        </b-field>
        <b-field horizontal :label="selectedType['lock']" v-if="selectedType['lock']">
          <b-select v-model="lock">
            <option>true</option>
            <option>false</option>
          </b-select>
        </b-field>
        <b-field horizontal :label="$t('lang.dao.description-row')">
            <b-input type="textarea" v-model="description"></b-input>
        </b-field>
        <b-field horizontal :label="$t('lang.dao.period-row')">
            <b-field :type="getType(validPeriod)">
                <b-datepicker
                    placeholder="$t('lang.common.click-to-select')"
                    v-model="debatingPeriod"
                    icon="calendar"
                    icon-pack="fas"
                    expanded
                    ></b-datepicker> 
            </b-field>
            <b-field :type="getType(validPeriod)">
                  <b-timepicker
                    placeholder="$t('lang.common.set-time')"
                    icon="clock"
                    v-model="debatingTime"
                    icon-pack="fas"
                    expanded
                    ></b-timepicker>
            </b-field>
        </b-field>
        <b-field horizontal :label="selectedType['code']" v-if="selectedType['code']" >
            <b-field :message="bytecodeMessage" :type="validCode ? 'is-success' : 'is-danger'">
                <b-input type="textarea" v-model="transactionBytecode" placeholder="0"></b-input>
            </b-field>
        </b-field>
        <b-field horizontal>
            <p class="control">
                <button class="button is-primary" v-on:click="createProposal()"
                    :disabled="!validAll"
                    :class="{'is-loading': isLoading}">
                  {{ $t('lang.dao.create-proposal') }}
                </button>
                <b-tag v-if="!validTokens">{{ $t('lang.dao.not-enough-tokens') }}</b-tag>
                <b-tag v-if="!validPeriod">{{ $t('lang.dao.debating-period-1') }} {{ $libre.proposalParams.minTime / 60 / 60 }} {{ $t('lang.dao.debating-period-2') }})</b-tag>
            </p>
        </b-field>
      </div>
      <div class="level"></div>
    </div>

</template>

<script>
import Vue from 'vue'
import i18n from '../locales'
export default {
  data () {
    return {
      proposalData: [],
      daoAddress: '',
      defaultAddress: '',
      tokensCount: '',
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
      isLoading: false,
      now: new Date()
    }
  },
  computed: {
    validBenef() {
        return !this.selectedType['benef'] || web3.isAddress(this.beneficiary)
    },

    validAmount() {
        return !this.selectedType['amount'] || (+this.amount >= 0)
    },

    validBuf() {
        return !this.selectedType['buf'] || (+this.buffer >= 0)
    },

    validPeriod() {
        let debatingEnd = new Date(this.debatingPeriod)
        // Refactor it  
        debatingEnd.setHours(this.debatingTime.getHours(), this.debatingTime.getMinutes())
        return (debatingEnd - this.now) > this.$libre.proposalParams.minTime * 1000 + 10 * 1000 /* milliseconds */;
    },

    validCode() {
        return !this.selectedType['code'] || /^0x[0-9a-fA-F]*$/.test(this.transactionBytecode)
    },

    validAll() {
        return (this.validBenef && this.validAmount && this.validBuf &&
                this.validPeriod && this.validCode && this.validTokens)
    },

    bytecodeMessage() {
        return this.$libre.bytecodeToString(this.beneficiary,this.transactionBytecode)
    },

    validTokens() {
        return this.tokensCount >= this.$libre.toToken(this.$libre.proposalParams.minBalance)
    }
  },
  methods: {
    async getTokensCount () {
       await this.$libre.promiseLibre;
       this.tokensCount = +await this.$libre.liberty.balanceOf(this.defaultAddress) / 10 ** this.$libre.consts.DECIMALS;
    },

    getType(fieldValid) {
        return fieldValid ? '' : 'is-danger'
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

      this.isLoading = true

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
          this.$libre.notify(i18n.t('lang.dao.create-error'));
        }
      }
      catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg,'is-danger');
      }

      this.isLoading = false
    },
    startValidDataTimer () {
      this.validDataTimer = setInterval(() => {
        this.now = Date.now();
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
      this.daoAddress = Vue.config.libre.dao.address;
      this.defaultAddress = window.web3.eth.defaultAccount;
      this.getTokensCount();
      this.startValidDataTimer();
      this.selectedType = this.typeProposals[0];
    } catch (err) {
      console.log(err)
    }
  },
  async destroyed () {
    this.endValidDataTimer();
  },
  watch: {
    selectedType: function() {
      this.beneficiary = this.amount = this.transactionBytecode = this.buffer = '';
      this.debatingPeriod = this.debatingTime = new Date();
    }
  }
}
</script>