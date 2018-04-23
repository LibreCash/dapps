/* eslint-disable-one-var */
<template>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">LibreBank Contract</h2>
      </div>
      <br>
      <div class="card">
        <div class="card-content">
            <h3 class="subtitle"><center>Exchanger contract status</center></h3>
            <status-bank :tableData='emissionStatus'></status-bank>
        </div>
        
      </div>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
    </section>
</template>

<script>
import StatusBank from '@/components/StatusBank'
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
      this.isLoadingBank = true

      var
        exchanger = this.$libre.bank,
        status = Config.bank.status

      this.emissionStatus.push({
        type: 'input',
        name: 'Contract address',
        data: Config.bank.address
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

      this.isLoadind = false
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
  },
  components: {
    StatusBank
  }
}
</script>