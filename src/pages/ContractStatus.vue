/* eslint-disable-one-var */
<template>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">LibreBank Contract</h2>
      </div>
      <div class="level"></div>
      <div class="cards">
        <div class="card-content">
          <h3 class="subtitle"><center>Emission contract status</center></h3>
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
      </div>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
    </section>
</template>

<script>
import Vue from 'vue'
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
        status = Vue.config.libre.bank.status

      this.emissionStatus.push({
        type: 'input',
        name: 'Contract address',
        data: Vue.config.libre.bank.address
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