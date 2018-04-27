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
          <section v-if="searchData.length == 0" class="level-item">No reports found</section>
          <section v-if="searchData.length > 0" class="level-item">
            <b-table
              :is-fullwidth="true"
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
                <b-table-column label='Report' centered>
                  {{ props.row.report }}
                </b-table-column>
              </template>
            </b-table>
            </section>
        </div>
    </div>
</template>



<script>
import Vue from 'vue'
import BRadioButton from 'buefy/src/components/radio/RadioButton'
export default {
  data () {
    return {
      reportAddress: '',
      reportText: '',
      owner: false,
      reportNumber: 0,
      searchData: [],
      isLoading: false,
      currentPage: 1,
      perPage: 5
    }
  },
  methods: {
    async search () {
      this.searchReports()
    },
    async newReport () {
      try {
        this.isLoading = true;
        let txHash = await this.$libre.report.addNewReport(this.reportText);
        if (await this.$eth.isSuccess(txHash)) {
          this.searchReports();
        } else {
          this.$snackbar.open('Creating report error');
        }
        this.isLoading = false;
      } catch (err) {
        console.log(err);
        this.$snackbar.open(err);
        this.isLoading = false;
      }
    },
    async searchReports () {
      this.searchData = []
      this.isLoading = true
      try {
        let j = await this.$libre.report.counter()
        for (let i = j - 1; i >= 0; --i) {
          let report = await this.$libre.report.reports(i)
          this.searchData.push({date: new Date(report[1] * 1000).toLocaleString(), report: report[0]})
        }
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },
    async loadReport () {
      this.reportNumber = await this.$libre.report.counter()
    },
    async loadETH () {
      this.isLoading = true
      try {
        await this.loadReport()
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },
    async canVote (number) {
      return true
    },
    async checkOwner () {
      this.owner = this.$eth.yourAccount == await this.$libre.report.owner()
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.reportAddress = Vue.config.libre.report.address;
      this.loadETH();
      this.loadReport();
      this.search();
      this.checkOwner();
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    BRadioButton
  }
}
</script>