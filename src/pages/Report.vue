<template>
  <div class="table-padding max-width">
        <section v-if="owner">
          <b-field>
            <b-input
              v-model="reportText"
              type="textarea"
              :placeholder="$t('lang.reports.write')">
            </b-input>
          </b-field>
          <a class="button is-info" v-on:click="newReport" :class="{'is-loading': isLoading}">{{ $t('lang.common.submit') }}</a>
        </section>
          <section v-if="searchData.length == 0">{{ $t('lang.reports.no-reports') }}</section>
          <section v-if="searchData.length > 0">
            <b-table
              :data="searchData"
              :bordered="false"
              :striped="true"
              :narrowed="false"
              :loading="isLoading"
              :paginated="perPage < searchData.length"
              :per-page="perPage"
              :current-page.sync="currentPage"
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
      reportText: '',
      owner: false,
      searchData: [],
      isLoading: false,
      currentPage: 1,
      perPage: 5,
    }
  },
  methods: {
    async newReport () {
      this.isLoading = true

      // Append JSON validating here before posting report
      try {
        let txHash = await this.$libre.report.addNewReport(this.reportText);
        
        if (await this.$eth.isSuccess(txHash)) {
          await this.loadReports();
        } else {
          this.$libre.notify(this.$t('lang.reports.create-error'));
        }
      } catch (err) {
        console.log(err);
        this.$libre.notify(err,'is-danger');
      }
      
      this.isLoading = false
    },
    async loadReports () {
      this.isLoading = true
      try {
        let j = await this.getCount();
        
        for (let i = j - 1; i >= 0; --i) {
            this.searchData.push(await this.getReport(i))
        }
      } catch (err) {
        console.log(err)
      }

      this.isLoading = false
    },

    async getReport(i) {
      let 
        raw = await this.$libre.report.reports(i), 
        result;
      try {
          result = JSON.parse(raw[0])
      } catch (err) {
          // if json parser error got use report text as is
          result = {descr: raw[0], nojson: true}
      }
      result.date = +raw[1] == 0 ? '-' : this.$d(raw[1] * 1000, 'short');
      result.id = i
      return result
    },

    async getCount() {
      return await this.$libre.report.counter()
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