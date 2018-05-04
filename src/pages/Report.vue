<template>
  <div class="table-padding max-width">
    <section v-if="owner">
      <b-field :type="validateForm() ? '' : 'is-danger'">
        <b-input v-model="reportText" type="textarea" :placeholder="$t('lang.reports.write')"></b-input>
      </b-field>
      <button class="button is-info" v-on:click="newReport" :class="{'is-loading': isLoading}" :disabled="!validateForm()">
        {{ $t('lang.common.submit') }}
      </button>
    </section>
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
      reportText: 
`{
  "tp": "type",
  "descr": "Description",
  "asset": "ETH",
  "from": "",
  "to": "",
  "txAm": "-"
}`,
      owner: false,
      searchData: [],
      isLoading: true,
      perPage: 5,
    }
  },
  methods: {
    validateForm () {
      try {
        let json = JSON.parse(this.reportText);
        let {tp, descr, asset, from, to, txAm} = json;
        if (tp == undefined || tp == '') throw false;
        if (descr == undefined || descr == '') throw false;
        if (asset == undefined || asset == '') throw false;
        if (from != "" && !this.$eth.isAddress(from)) throw false;
        if (to != "" && !this.$eth.isAddress(to)) throw false;
        if (txAm == undefined) throw false;

        return JSON.stringify({tp, descr, asset, from, to, txAm});
      } catch(err) {
        return false;
      }
    },
    async newReport () {
      this.isLoading = true;
      try {
        let json = this.validateForm();
        if (!json) throw this.$t('lang.reports.invalid-data');
        let txHash = await this.$libre.report.addNewReport(this.reportText);
        
        if (await this.$eth.isSuccess(txHash)) {
          await this.loadReports();
        } else {
          this.$libre.notify(this.$t('lang.reports.create-error'));
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
    } catch (err) {
      console.log(err)
    }
  }
}
</script>