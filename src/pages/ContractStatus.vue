/* eslint-disable-one-var */
<template>
      <div class="level">
        <div class="level-item">
            <b-table
              class="centered"
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
                <b-table-column :label="$t('lang.common.value')" centered>
                    <span class="is-text-overflow">{{ props.row.data }}</span>
                </b-table-column>
              </template>
            </b-table>
        </div>
        <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
      </div> 
</template>

<script>
import i18n from '../locales'
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
        type: 'input',
        name: 'Contract address',
        data: this.config.bank.address
      })

      let 
        dataBank = await Promise.all(status.map(obj => exchanger[obj.getter]().catch(e => 'error'))),
        tokenBalance = await this.$libre.token.balanceOf(this.config.bank.address).catch(e=>'error'),
        totalSupply = await this.$libre.token.totalSupply().catch(e => 'error')
      status.forEach((item, i) => {
        if(dataBank[i] !== 'error') {
          this.emissionStatus.push({
            type: item.type,
            name: item.name,
            data: status[i].process(dataBank[i])
          })
        }
      })

      this.emissionStatus.push({
        name: i18n.t('lang.common.total-supply'),
        data: totalSupply !== 'error' ? `${this.$libre.toToken(totalSupply)} LIBRE` : '-'
      },{
        name: i18n.t('lang.common.exchanger-balance'),
        data: tokenBalance !== 'error' ? `${this.$libre.toToken(totalSupply)} LIBRE` : '-'
      })


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