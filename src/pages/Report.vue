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
                <b-table-column label='Description' centered :colspan="props.row.nojson ? 6 : 1">
                  {{ props.row.descr }}
                </b-table-column>
                <b-table-column label='Type' centered v-if="!props.row.nojson">
                  {{ props.row.tp }}
                </b-table-column>
                <b-table-column label='Asset' centered v-if="!props.row.nojson">
                  {{ props.row.asset }}
                </b-table-column>
                <b-table-column label='From' centered v-if="!props.row.nojson">
                  <span v-if="isAddress(props.row.from)"><a :href="$libre.addressToLink(props.row.asset)">address</a></span>
                  <span v-else>{{ props.row.from }}</span>                  
                </b-table-column>
                <b-table-column label='To' centered v-if="!props.row.nojson">
                  <span v-if="isAddress(props.row.to)"><a :href="$libre.addressToLink(props.row.asset)">address</a></span>
                  <span v-else>{{ props.row.to }}</span>                  
                </b-table-column>
                <b-table-column label='txAm' centered v-if="!props.row.nojson">
                  {{ props.row.txAm }}
                </b-table-column>
              </template>
            </b-table>
            </section>
        </div>
    </div>
</template>

<script>
import Config from '@/config'
import BRadioButton from 'buefy/src/components/radio/RadioButton'
export default {
  data () {
    return {
      reportAddress: '',
      reportText: '',
      owner: false,
      reportNumber: 0,
      rawData: [],
      searchData: [],
      isLoading: false,
      currentPage: 1,
      perPage: 5
    }
  },
  methods: {
    isAddress (address) {
      return web3.isAddress(address)
    },

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
      this.rawData = []
      //this.rawData.push({date: new Date().toLocaleString(), report: '{"tp": "wow", "asset":"libre","from":"0x","to":"0x","descr":"i","txAm":"lll"}'})
      //this.rawData.push({date: new Date().toLocaleString(), report: "For testing purposes 2"})
      //this.rawData.push({date: new Date().toLocaleString(), report: "Report for testing purposes 3"})
      //this.rawData.push({date: new Date().toLocaleString(), report: "Report for testing purposes 4"})
      //this.rawData.push({date: new Date().toLocaleString(), report: "For testing purposes 5"})
      this.isLoading = true
      try {
        let j = await this.$libre.report.counter()
        for (let i = j - 1; i >= 0; --i) {
          let report = await this.$libre.report.reports(i)
          this.rawData.push({date: new Date(report[1] * 1000).toLocaleString(), report: report[0]})
        }
      } catch (err) {
        console.log(err)
      }
      this.searchData = this.rawData.map((val) => {
        let result;
        try {
          result = JSON.parse(val.report);
          result.date = val.date;
        } catch (err) {
          result = {date: val.date, descr: val.report, nojson: true};
        }
        return result;
      });
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
      this.reportAddress = Config.report.address[this.$eth.network];
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