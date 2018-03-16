<template>
    <div>
      <section class="allMain">
        <div class="h2-contain">
          <h2 class="subtitle">Reports History</h2>
        </div>
        <br>
        <section v-if="owner" class="table-padding">
          <b-field>
            <b-input
              v-model="reportText"
              type="textarea"
              placeholder='Write Report'>
            </b-input>
          </b-field>
          <a class="button is-info" v-on:click="newReport">Submit</a>
        </section>
        <br>
        <search-results :tableData='searchData'></search-results>
        <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
      </section>
    </div>
</template>



<script>
import SearchResults from '@/components/SearchResults'
import BRadioButton from 'buefy/src/components/radio/RadioButton'
export default {
  data () {
    return {
      reportAddress: this.$eth.reportAddress,
      reportText: '',
      owner: false,
      reportNumber: 0,
      searchData: [],
      isLoading: false
    }
  },
  methods: {
    async search () {
      this.searchReports()
    },
    async newReport () {
      try {
        await this.$eth.addNewReport(this.reportText)
      } catch (err) {
        console.log(err)
      }
    },
    async searchReports () {
      this.searchData = []
      this.isLoading = true
      try {
        let j = await this.$eth.reportCounter()
        for (let i = j - 1; i > 0; --i) {
          let report = await this.$eth.getReport(i)
          console.log(report)
          this.searchData.push({date: new Date(report[1] * 1000).toLocaleString(), report: report[0]})
        }
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },
    async loadReport () {
      this.reportNumber = await this.$eth.reportCounter()
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
      this.owner = await this.$eth.isOwner()
    }
  },
  created () {
    try {
      this.loadETH()
      this.loadReport()
      this.search()
      this.checkOwner()
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    SearchResults,
    BRadioButton
  }
}
</script>