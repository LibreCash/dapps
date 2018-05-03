<template>
    <div>
      <div class="table-padding">
        <router-link :to="{ path: '/reports' }" class="button">
          <div class="icon">
            <i class="fas fa-arrow-left" size="is-small"></i>
          </div>
          <div>{{ $t('lang.common.back') }}</div>
        </router-link>
        <div class="level"></div>
        <div class="container table-padding">
          <section v-if="!reportData.length" class="">{{ $t('lang.reports.incorrect') }}</section>
          <section v-else class="">
            <b-table
             :data="reportData"
             :bordered="false"
             :striped="true"
             :narrowed="false"
             :loading="isLoading"
             :mobile-cards="true">
            <template slot-scope="props">
            <b-table-column v-if="props.row.data" :label="$t('lang.common.parameter')" class="hidden-mobile">
              <strong>{{ props.row.name }}</strong>
            </b-table-column>
            <td v-if="props.row.data && props.row.type == 'address'" :data-label="$t('lang.common.value-row')" class="flex-mobile flex-centered">
                  <a :href="$libre.addressToLink(props.row.data)" class="is-text-overflow">{{ props.row.data }}</a>
            </td> 
            <b-table-column v-if="props.row.data && props.row.type != 'address'" :label="$t('lang.reports.value-row')" centered class="flex-mobile flex-wrap text-wrap">
              {{ props.row.data }}
            </b-table-column>
          </template>
        </b-table>
          </section>
        </div>
    </div>
    </div>
</template>
<style>
</style>

<script>
import Config from '@/config'
import i18n from '../locales'
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
	  result.date = +raw[1] == 0 ? '-' : i18n.d(raw[1] * 1000, 'long');
	  console.log(result)
      return result
	},

	async drawReport(i) {
		//{"tp": "wow", "asset":"libre","from":"0x","to":"0x","descr":"i","txAm":"lll"}
		let report = await this.getReport(i);

		this.reportData.push({
			name: i18n.t('lang.reports.time-row'),
			data: report.date
		},
		{
			name: i18n.t('lang.reports.type-row'),
			data: report.tp
		},
		{
			name: i18n.t('lang.reports.asset-row'),
			data: report.asset,
		},
		{
			name: i18n.t('lang.reports.from-row'),
			data: report.from,
			type:'address'
		},
		{
			name: i18n.t('lang.reports.value-row'),
			data: report.txAm,
		},
		{
			name: i18n.t('lang.reports.to-row'),
			data: report.to,
			type: 'address'
		},
		{
			name: i18n.t('lang.reports.description-row'),
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