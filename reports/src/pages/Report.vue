<template>
  <div class="container">
      <h1 class="title">
        <div class="level">
          <div class="level-item">
            <img src="static/img/logo.png" width="200" height="180"/>
          </div>
        </div>
      </h1>
    <section v-if="owner" class="box">
      <b-field>
        <b-input
          v-model="reportText"
          type="input"
          placeholder='Write Report'>
        </b-input>
      </b-field>
      <a class="button is-info" v-on:click="newReport">Submit</a>
    </section>
    <section class="box">
      <div class="level-item">
        <h2 class="subtitle">Reports History</h2>&nbsp;
      </div>
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
