/* eslint-disable-one-var */
<template>
      <div class="cards">
        <div class="card-content">
          <div id="status-bank">
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
                <b-table-column field="name" label='Name'>
                  {{ props.row.name }}
                </b-table-column>
                <b-table-column label='Status' centered>
                  <input class="address" v-if="props.row.type == 'input'" type="text" :value="props.row.data" disabled="disabled" size="25">
                  <span v-else>{{ props.row.data }}</span>
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

      let dataBank = await Promise.all(status.map(obj => exchanger[obj.getter]()
        .catch(e => 'error')))

      status.forEach((item,i)=>{
        this.emissionStatus.push({
          type: item.type,
          name: item.name,
          data: dataBank[i] !== 'error' ? status[i].process(dataBank[i]) : '-'
        })
      })
  

      let totalSupply = await this.$libre.token.totalSupply().catch(e => 'error')
      this.emissionStatus.push({
        name: 'Total Supply',
        data: totalSupply !== 'error' ? `${totalSupply / 10 ** 18} LIBRE` : '-'
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