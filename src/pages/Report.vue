<template>
  <div>
        <section v-if="owner" class="table-padding">
          <b-field>
            <b-input
              v-model="reportText"
              type="textarea"
              placeholder='Write Report'>
            </b-input>
          </b-field>
          <a class="button is-info" v-on:click="newReport" :class="{'is-loading': isLoading}">Submit</a>
        </section>
        <div class="level">
          <section v-if="searchData.length == 0" class="level-item ">No reports found</section>
          <section v-if="searchData.length > 0" class="level-item footer-resp">
            <b-table
              class="table-container"
              :data="searchData"
              :bordered="false"
              :striped="true"
              :narrowed="false"
              :loading="isLoading"
              :paginated="true"
              :per-page="perPage"
              :current-page.sync="currentPage"
              :pagination-simple="false"
              :mobile-cards="true">
              <template slot-scope="props">
                <b-table-column label='Date' centered>
                  {{ props.row.date }}
                </b-table-column>
                <b-table-column label='Description' centered :colspan="props.row.nojson ? 6 : 0">
                  {{ props.row.descr | truncate(10)}}
                </b-table-column>
                <b-table-column label='Type' centered v-if="!props.row.nojson">
                  {{ props.row.tp }}
                </b-table-column>
                <b-table-column label='Asset' centered v-if="!props.row.nojson">
                  {{ props.row.asset }}
                </b-table-column>
                <b-table-column label='Actions' centered v-if="!props.row.nojson">
                  <router-link class="button" :to="{name: 'Report Page', params: { id: props.row.id }}" tag="button"><i class="fas fa-id-card"></i></router-link>
                </b-table-column>
              </template>
            </b-table>
          </section>
        </div>
    </div>
</template>
<style>
.footer-resp {
  max-width: 100%;
}
</style>
<script>
import Config from '@/config'

export default {
  data () {
    return {
      reportAddress: '',
      curReport: {},
      reportText: '',
      owner: false,
      reportNumber: 0,
      rawData: [],
      searchData: [],
      isLoading: false,
      currentPage: 1,
      perPage: 5,
      isReportModalActive: false
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
          this.$libre.notify('Creating report error');
        }
      } catch (err) {
        console.log(err);
        this.$libre.notify(err,'is-danger');
      }
      
      this.isLoading = false
    },
    async loadReports () {
      //this.rawData.push({date: new Date().toLocaleString(), report: '{"tp": "wow", "asset":"libre","from":"0x","to":"0x","descr":"i","txAm":"lll"}'})
      //this.rawData.push({date: new Date().toLocaleString(), report: "For testing purposes 2"})

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
      result.date = this.$eth.toDateString(raw[1])
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