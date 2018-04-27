/* eslint-disable-one-var */
<template>
      <div class="cards">
        <div class="card-content">
          <div id="status-bank">
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
                <b-table-column field="name" label='Parameter'>
                  {{ props.row.name }}
                </b-table-column>
                <b-table-column label='Value' centered >
                <span class="is-text-overflow">{{ props.row.data }}</span>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>
        <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
      </div> 
</template>

<script>
import Config from '@/config'
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
        status = Config.bank.status

      this.emissionStatus.push({
        type: 'input',
        name: 'Contract address',
        data: Config.bank.address[this.$eth.network]
      })

      let dataBank = await Promise.all(status.map(obj => exchanger[obj.getter]().catch(e => 'error')))
      let totalSupply = await this.$libre.token.totalSupply().catch(e => 'error')
      status.forEach((item,i)=>{
        if(dataBank[i] !== 'error') {
          this.emissionStatus.push({
            type: item.type,
            name: item.name,
            data: status[i].process(dataBank[i])
          })
        }
      })

      this.emissionStatus.push({
        name: 'Total Supply',
        data: totalSupply !== 'error' ? `${this.$libre.toToken(totalSupply)} LIBRE` : '-'
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