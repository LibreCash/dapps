<template>
  <div class="table-padding max-witdh">
    <div class="column">
      <router-link :to="{ path: '/reports' }" class="button">
        <div class="icon">
          <i class="fas fa-arrow-left" size="is-small"></i>
        </div>
        <div>{{ $t('lang.common.back') }}</div>
      </router-link>
    </div>
      <div class="max-width">
        <section v-if="!reportData.length && !isLoading" class="">{{ $t('lang.reports.incorrect') }}</section>
        <section v-else class="max-width">
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
            <td v-if="props.row.data && props.row.type == 'address' && $eth.isAddress(props.row.data)"
                :data-label="$t('lang.common.value-row')" class="flex-mobile text-wrap">
              <a :href="$libre.addressToLink(props.row.data)" class="is-text-overflow">{{ props.row.data }}</a>
            </td> 
            <b-table-column v-if="props.row.data && (props.row.type != 'address' || !$eth.isAddress(props.row.data))"
                :label="$t('lang.reports.value-row')" class="flex-mobile flex-wrap text-wrap">
              {{ props.row.data }}
            </b-table-column>
          </template>
        </b-table>
      </section>
    </div>
  </div>
</template>

<script>
import Config from "@/config";
export default {
  data() {
    return {
      reportId: +this.$route.params.id,
      reportData: [],
      isLoading: true,
      loggedIn: false
    };
  },
  methods: {
    async drawReport(i) {
      //{"tp": "wow", "asset":"libre","from":"0x","to":"0x","descr":"i","txAm":"lll"}
      let report = await this.$libre.getReport(i);

      this.reportData.push(
        {
          name: this.$t("lang.reports.time-row"),
          data: report.date
        },
        {
          name: this.$t("lang.reports.type-row"),
          data: report.tp
        },
        {
          name: this.$t("lang.reports.asset-row"),
          data: report.asset
        },
        {
          name: this.$t("lang.reports.from-row"),
          data: report.from,
          type: "address"
        },
        {
          name: this.$t("lang.reports.value-row"),
          data: report.txAm
        },
        {
          name: this.$t("lang.reports.to-row"),
          data: report.to,
          type: "address"
        },
        {
          name: this.$t("lang.reports.description-row"),
          data: report.descr
        }
      );
      return;
    }
  },
  async created() {
    try {
      await this.$eth.accountPromise;
      await this.$libre.init;
      await this.drawReport(this.reportId);
      this.isLoading = false;
    } catch (err) {
      console.log(err);
    }
  }
};
</script>