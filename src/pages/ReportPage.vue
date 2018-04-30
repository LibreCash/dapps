<template>
    <div>
      <div class="table-padding">
        <router-link :to="{ path: '/reports' }" class="button">
          <div class="icon">
            <i class="fas fa-arrow-left" size="is-small"></i>
          </div>
          <div>Back</div>
        </router-link>
        <div class="level"></div>
        <div class="level">
          <section v-if="!reportData.length" class="level-item ">Incorrect report number</section>
          <section v-if="reportData.length" class="level-item footer-resp">
			<b-table
			 :data="reportData"
			 :bordered="false"
			 :striped="true"
			 :narrowed="false"
			 :loading="isLoading"
			 :mobile-cards="true">
			<template slot-scope="props">
            <b-table-column v-if="props.row.data">
              <strong>{{ props.row.name }}</strong>
            </b-table-column>
            <b-table-column centered class="flex" v-if="props.row.data">
              <a  v-if="props.row.type == 'address'" :href="$libre.addressToLink(props.row.data)" target="_blank" class="is-text-overflow">{{props.row.data}}</a>
              <span v-else>{{ props.row.data }}</span>
            </b-table-column>
          </template>
        </b-table>
          </section>
        </div>
    </div>
    </div>
</template>

<script>
import Config from '@/config'
export default {
  data () {
    return {
      reportId: +this.$route.params.id,
      reportData: [],
      isLoading: false,
      loggedIn: false,
    }
  },
   methods: {
	isAddress (addr) {
    	return this._web3.utils.isAddress(addr)
  	},
	// TODO:Use single method from, Report.vue. 
    async getReport(i) {
      let 
        raw = await this.$libre.report.reports(i), 
		result;
		console.log(raw);
      try {
          result = JSON.parse(raw[0])
      } catch (err) {
          // if json parser error got use report text as is
          result = {descr: raw[0], nojson: true}
      }
	  result.date = this.$eth.toDateString(raw[1])
	  console.log(result)
      return result
	},

	async drawReport(i) {
		//{"tp": "wow", "asset":"libre","from":"0x","to":"0x","descr":"i","txAm":"lll"}
		let report = await this.getReport(i);

		this.reportData.push({
			name:'Type',
			data:report.tp
		},
		{
			name:'Asset',
			data:report.asset,
		},
		{
			name:'From',
			data:report.from,
			type:'address'
		},
		{
			name: 'Value',
			data: report.txAm,
		},
		{
			name:'To',
			data:report.to,
			type:'address'
		},
		{
			name:'Description',
			data: report.descr,
		}
		)
		return;
	}
  },
  async created () {
    try {
	  await this.$eth.accountPromise;
	  await this.$libre.init;
	  await this.drawReport(this.reportId)
    } catch (err) {
      console.log(err)
    }
  }
}
</script>