<template>
  <div>
      <div class="table-padding">
        <div class="card">
            <div class="card-content">
                <address-block/>
                <div class="flex">{{ $t('lang.contracts.loans') }}: <a class="address is-text-overflow" :href="$libre.addressToLink(loansAddress)">{{loansAddress}}</a></div>
                <div>{{ $t('lang.common.current-time') }}: {{ new Date(curBlockchainTime * 1000).toLocaleString() }}</div>
            </div>
        </div>
        <div class="level"></div>
        <nav class="level has-text-centered">
          <div class="level-item" v-if="canCreate">
            <div>
              <p class="heading">{{ $t('lang.common.create') }}</p>
              <p><router-link :to="{ path: '/loans/new' }" class="button is-primary">{{ $t('lang.loans.new-offer') }}</router-link></p>
            </div>
          </div>
          <div class="level-item">
            <div>
              <p class="heading">{{ $t('lang.loans.loan-type') }}</p>
              <p>
                <b-field>
                  <b-radio-button v-model="ethType" native-value="ETH" type="is-success" @input="loadLoans()">ETH</b-radio-button>
                  <b-radio-button v-model="ethType" native-value="Libre" type="is-success" checked @input="loadLoans()">Libre</b-radio-button>
                </b-field>
              </p>
            </div>
          </div>
          <div class="level-item">
            <div>
              <p class="heading">{{ $t('lang.loans.loan-state') }}</p>
              <p>
                <b-switch v-model="isActive" @input="loadLoans()">{{ $t('lang.loans.state-active') }}</b-switch>
                <b-switch v-model="isUsed" @input="loadLoans()">{{ $t('lang.loans.state-used') }}</b-switch>
                <b-switch v-model="isCompleted" @input="loadLoans()">{{ $t('lang.loans.state-completed') }}</b-switch>
                <b-switch v-model="isMine" @input="loadLoans()">{{ $t('lang.loans.state-own') }}</b-switch>
              </p>
            </div>
          </div>
        </nav>
        <div class="level"></div>
        <div v-if="loansCount == 0 || searchData.length == 0" class="has-text-centered">
          {{ $t('lang.loans.no-loans') }}
        </div>
        <b-table
          v-if="searchData.length > 0"
          :data="searchData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="tableLoading"
          :per-page="perPage"
          :current-page.sync="currentPage"
          :mobile-cards="true"
          :responsive="true">
          <template slot-scope="props" v-if="!props.row.tempHide">
            <b-table-column :label="$t('lang.loans.holder-row')" centered v-if="props.row.holder == '-'">
                {{ $t('lang.common.not-set') }}
            </b-table-column>
            <b-table-column :label="$t('lang.loans.holder-row')" centered v-else>
              <a :href="$libre.addressToLink(props.row.holder)" target="_blank" class="is-text-overflow">{{ $t('lang.common.address') }}</a>
            </b-table-column>
            <b-table-column :label="$t('lang.loans.recipient-row')" centered v-if="props.row.recipient == '-'">
                {{ $t('lang.common.not-set') }}
            </b-table-column>
            <b-table-column :label="$t('lang.loans.recipient-row')" centered v-else>
              <a :href="$libre.addressToLink(props.row.recipient)" target="_blank" class="is-text-overflow">{{ $t('lang.common.address') }}</a>
            </b-table-column>
            <b-table-column :label="$t('lang.loans.date-row')" centered>
              {{ props.row.timestamp }}
            </b-table-column>
            <b-table-column :label="$t('lang.loans.period-row')" centered>
              {{ props.row.period }}
            </b-table-column>
            <b-table-column :label="$t('lang.loans.amount-row')" centered>
              {{ props.row.amount }} {{ props.row.type }}
            </b-table-column>
            <b-table-column :label="$t('lang.loans.margin-row')" centered>
              {{ props.row.margin }} {{ props.row.type }}
            </b-table-column>
            <b-table-column :label="$t('lang.loans.refund-row')" centered>
              {{ props.row.refund }} {{ props.row.type }}
            </b-table-column>
            <b-table-column :label="$t('lang.loans.status-row')" centered>
              {{ props.row.status }}
            </b-table-column>
            <b-table-column :label="$t('lang.loans.actions-row')" centered>
              <router-link class="button" :to="{name: 'Loan Offer', params: { type: props.row.type, id: props.row.id }}" tag="button"><i class="fas fa-id-card"></i></router-link>
            </b-table-column>
          </template>
        </b-table>
        <div class="level"></div>
        <div class="columns">
          <div class="column is-narrow">
            <b-tooltip :label="$t('lang.common.tooltips.items-on-page')">
              <b-field>
                <b-select v-model="perPage" @input="loadLoans()">
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="300">300</option>
                </b-select>
              </b-field>
            </b-tooltip>
          </div>
          <div class="column">
            <b-pagination
                v-if="loansCount > perPage"
                @change="loadLoans"
                :total="loansCount"
                :current.sync="vpage"
                :simple="false"
                :order="is-centered"
                :rounded="true"
                :per-page="perPage">
            </b-pagination>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import AddressBlock from '@/components/AddressBlock'
import Vue from 'vue'
//import i18n from '../locales' // not used yet
export default {
  data () {
    return {
      tableLoading: false,
      currentPage: 1,
      perPage: 5,
      curBlockchainTime: 0,
      loansAddress: '',
      searchData: [],
      defaultAddress: '',
      pages: [1],
      vpage: 1,
      ethType: 'ETH',
      isActive: true,
      isUsed: false,
      isCompleted: false,
      isMine: false,
      loansCount: 0,
      perPage: 10,
      curBlockchainTime: 0,
      canCreate: true
    }
  },
  methods: {
    async loadLoans (e) {
      this.defaultAddress = window.web3.eth.defaultAccount;
      this.loansAddress = Vue.config.libre.loans.address;
      this.searchData = [];
      if (!this.isActive && !this.isUsed && !this.isCompleted) {
        return;
      }
      let
        _page = 1,
        status = this.$libre.loansStatus;
      if (e) {
        // it was pagination event
        _page = e;
      }
      let offers = +this.isActive * 1 + +this.isUsed * 2 + +this.isCompleted * 4 +this.isMine * 8;
      let _type = (this.ethType === 'ETH') ? 1 : 0;

      const pageCount = this.perPage;
      const maxUINT256 = 2**256 - 1;
      const struct = this.$libre.loansStruct

      this.tableLoading = true
      try {
        this.loansCount = +await this.$libre.loans.getLoanCount(_type, offers);
        let loanIDs = await this.$libre.loans.getLoans([_page - 1, pageCount], _type, offers);
        let pages = Math.ceil(this.loansCount / pageCount);
        this.pages = Array.from(Array(pages)).map((e, i) => i + 1);
        let activeProposalShown = 0;
        for (var i = 0; i < loanIDs.length; i++) {
          // do not use forEach - we do not want async iterations
          if (+loanIDs[i] === maxUINT256) continue;
          var 
            loan = this.$libre.getLoanObject((this.ethType === "ETH") ?
              await this.$libre.loans.getLoanEth(loanIDs[i]) :
              await this.$libre.loans.getLoanLibre(loanIDs[i]));
          var loanData = loan[struct.data.outer];
          this.searchData.push({
              id: loanIDs[i],
              type: Object.keys(this.$libre.loansType)[_type],
              holder: loan.holder,
              recipient: this.$eth.isZeroAddress(loan.recipient) ? '-' : loan.recipient,
              timestampUnix: loan.timestamp,
              timestamp: new Date(loan.timestamp * 1000).toLocaleString(),
              period: this.$libre.periodToString(loan.period),
              amount: this.$eth.fromWei(loan.amount),
              margin: this.$eth.fromWei(loan.margin),
              refund: this.$eth.fromWei(loan.refund),
              status: loan.status
          })
        }
      } catch (err) {
        console.log(err)
      }

      this.tableLoading = false
    },
    async updateBlockTime() {
      this.curBlockchainTime = +(await this.$eth.getLatestBlockTime())
    },

    startUpdatingTime() {
      this.curBlockchainTime = 0
      this.updatingTicker = setInterval(() => {
        this.curBlockchainTime++
      }, 1000)
      this.updatingBlockData = setInterval(() => {
        this.updateBlockTime()
      }, 10 * 60 * 1000 /* 10 minutes */)
      this.updateBlockTime()
    },
    clearTimers() {
      let intervals = [
        this.updatingTicker,
        this.updatingBlockData,
      ]

      intervals.forEach((interval) => clearInterval(interval))
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.canCreate = this.$eth._web3.eth.defaultAccount != undefined;
      this.startUpdatingTime();
      this.loadLoans()
    } catch (err) {
      console.log(err)
    }
  },
  destroyed () {
    this.clearTimers();
  },
  components: {
    AddressBlock
  }
}
</script>