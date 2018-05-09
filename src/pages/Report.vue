<template>
  <div class="table-padding max-width">
    <div class="card">
      <div class="card-content">
        <div class="flex-mobile">{{ $t('lang.contracts.reports') }}: <a class="is-text-overflow" :href="$libre.addressToLink(config.report.address)">{{ config.report.address }}</a></div>
      </div>
    </div>
    <div class="level"></div>
    <section v-if="owner">
      <div class="level"></div>
      <b-collapse class="card" :open="false">
        <div slot="trigger" slot-scope="props" class="card-header">
          <p class="card-header-title">{{ $t('lang.reports.create') }}</p>
          <a class="card-header-icon"><b-icon :icon="props.open ? 'caret-down' : 'caret-up'" icon-pack="fas"></b-icon>
          </a>
        </div>
        <div class="card-content">
          <div class="content">
            <b-field horizontal :label="$t('lang.reports.type-row')">
              <b-field :type="reportNew.tp !== '' ? '' : 'is-danger'">
                <b-input v-model="reportNew.tp"></b-input>
              </b-field>
            </b-field>
            <b-field horizontal :label="$t('lang.reports.description-row')">
              <b-field :type="reportNew.descr !== '' ? '' : 'is-danger'">
                <b-input v-model="reportNew.descr"></b-input>
              </b-field>
            </b-field>
            <b-field horizontal :label="$t('lang.reports.asset-row')">
              <b-field :type="reportNew.asset !== '' ? '' : 'is-danger'">
                <b-input v-model="reportNew.asset" placeholder="ETH"></b-input>
              </b-field>
            </b-field>
            <b-field horizontal :label="$t('lang.reports.from-row')">
              <b-field :type="(reportNew.from === '') || ($eth.isAddress(reportNew.from)) ? '' : 'is-danger'">
                <b-input v-model="reportNew.from"></b-input>
              </b-field>
            </b-field>
            <b-field horizontal :label="$t('lang.reports.to-row')">
              <b-field :type="(reportNew.to === '') || ($eth.isAddress(reportNew.to)) ? '' : 'is-danger'">
                <b-input v-model="reportNew.to"></b-input>
              </b-field>
            </b-field>
            <b-field horizontal :label="$t('lang.reports.value-row')">
              <b-field>
                <b-input v-model="reportNew.txAm"></b-input>
              </b-field>
            </b-field>
            <button class="button is-info" v-on:click="newReport" :class="{'is-loading': isLoading}" :disabled="!validateForm()">
              {{ $t('lang.common.submit') }}
            </button>
          </div>
        </div>
      </b-collapse>
    </section>
    <div class="level"></div>
    <section v-if="searchData.length == 0 && !isLoading">
      {{ $t('lang.reports.no-reports') }}
    </section>
    <section v-if="searchData.length > 0">
      <b-table
        :data="searchData"
        :bordered="false"
        :striped="true"
        :narrowed="false"
        :loading="isLoading"
        :paginated="perPage < searchData.length"
        :per-page="perPage"
        :pagination-simple="false"
        :mobile-cards="true">
        <template slot-scope="props">
          <b-table-column :label="$t('lang.common.date')" centered>
            {{ props.row.date }}
          </b-table-column>
          <b-table-column :label="$t('lang.common.description')" class="flex-mobile text-wrap flex-wrap" centered :colspan="props.row.nojson ? 3 : 0">
            {{ props.row.descr }}
          </b-table-column>
          <b-table-column :label="$t('lang.common.type')" centered v-if="!props.row.nojson">
            {{ props.row.tp }}
          </b-table-column>
          <b-table-column :label="$t('lang.common.asset')" centered v-if="!props.row.nojson">
            {{ props.row.asset }}
          </b-table-column>
          <b-table-column :label="$t('lang.common.actions')" centered>
            <router-link class="button" :to="{name: 'Report Page', params: { id: props.row.id }}" tag="button"><i class="fas fa-id-card"></i></router-link>
          </b-table-column>
        </template>
      </b-table>
    </section>
  </div>
</template>
<script>
import Config from '@/config'
export default {
  data () {
    return {
      owner: false,
      searchData: [],
      isLoading: true,
      perPage: 5,
      reportNew: {
        tp: '',
        descr: '',
        asset: 'ETH',
        from: '',
        to: '',
        txAm: ''
      }
    }
  },
  methods: {
    validateForm () {
      try {
        if (!this.reportNew.tp || !this.reportNew.descr || !this.reportNew.asset ||
            !(this.reportNew.from === "" || this.$eth.isAddress(this.reportNew.from)) ||
            !(this.reportNew.to === "" || this.$eth.isAddress(this.reportNew.to))) {
              throw false;
            }

        return JSON.stringify(this.reportNew);
      } catch(err) {
        return false;
      }
    },
    async newReport () {
      this.isLoading = true;
      try {
        let json = this.validateForm();
        if (!json) throw this.$t('lang.reports.invalid-data');
        let txHash = await this.$libre.report.addNewReport(json);
        
        if (await this.$eth.isSuccess(txHash)) {
          await this.loadReports();
        } else {
          this.$libre.notify(this.$t('lang.reports.create-error'),'is-info');
        }
      } catch (err) {
        console.log(err);
        this.$libre.notify(err, 'is-danger');
      }
      this.isLoading = false;
    },
    async loadReports () {
      this.isLoading = true;
      this.searchData = [];
      try {
        let j = await this.$libre.report.counter();
        
        for (let i = j - 1; i >= 0; --i) {
          this.searchData.push(await this.$libre.getReport(i))
        }
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false;
    },
    async checkOwner () {
      this.owner = this.$eth.yourAccount == await this.$libre.report.owner()
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.loadReports();
      this.checkOwner();
      this.reportNew.from = this.reportNew.to = this.$eth.yourAccount;
    } catch (err) {
      console.log(err)
    }
  }
}
</script>