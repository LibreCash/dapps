/* eslint-disable-one-var */
<template>
  <div class="container table-padding max-width">
    <b-table
      :data="emissionStatus"
      :bordered="false"
      :striped="true"
      :narrowed="false"
      :loading="false"
      :paginated="false"
      :pagination-simple="false"
      :mobile-cards="true">
      <template slot-scope="props">
        <b-table-column field="name" :label="$t('lang.common.parameter')">
          {{ props.row.name }}
        </b-table-column>
        <td v-if="props.row.type == 'address'" :data-label="$t('lang.common.value-row')" class="flex-mobile">
          <a :href="$libre.addressToLink(props.row.data)" class="is-text-overflow">{{ props.row.data }}</a>
        </td> 
        <b-table-column v-else :label="$t('lang.common.value-row')">
          <span>{{ props.row.data }}</span>
        </b-table-column>
      </template>
    </b-table>
    <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
  </div> 
</template>

<script>
export default {
  data () {
    return {
      emissionStatus: [],
      isLoading: false,
    }
  },
  methods: {
    async getStatusBank () {
      this.isLoading = true
      var
        exchanger = this.$libre.bank,
        status = this.config.bank.status

      this.emissionStatus.push({
        type: 'address',
        name: this.$t('lang.common.contract-address'),
        data: this.config.bank.address
      })
      let
        dataBank = await Promise.all(status.map(obj => exchanger[obj.getter]().catch(e => 'error'))),
        tokenBalance = await this.$libre.token.balanceOf(this.config.bank.address).catch(e => 'error'),
        totalSupply = await this.$libre.token.totalSupply().catch(e => 'error');
      status.forEach((item, i) => {
        if (dataBank[i] !== 'error') {
          this.emissionStatus.push({
            type: item.type,
            name: item.name,
            data: item.type == 'address' ?
              (this.$eth.isZeroAddress(dataBank[i]) ? '-' : dataBank[i]) : status[i].process(dataBank[i])
          })
        }
      });
      this.emissionStatus.push({
        name: this.$t('lang.common.total-supply'),
        data: totalSupply !== 'error' ? `${this.$eth.toToken(totalSupply)} LIBRE` : '-'
      }, {
        name: this.$t('lang.common.exchanger-balance'),
        data: tokenBalance !== 'error' ? `${this.$eth.toToken(totalSupply)} LIBRE` : '-'
      });

      this.isLoading = false
    },
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.getStatusBank()
    } catch (err) {
      console.log(err)
    }
  }
}
</script>