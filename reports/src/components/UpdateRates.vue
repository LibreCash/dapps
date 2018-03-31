<template>
  <form action="">
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Update Rates</p>
        </header>
        <section class="modal-card-body">
            <span>State:</span>
            <b-message type="is-info">
              {{ text }}
            </b-message>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" @click="requestRates()">Request Rates</button>
          <button class="button is-primary" @click="calcRates()">Calc Rates</button>
        </footer>
    </div>
  </form>
</template>

<script>
import Config from '@/config'
export default {
  data() {
    return {
      text: "Hello"
    }
  },
  methods: {
    async requestRates() {
      try {
        let price = await this.$libre.bank.requestPrice(),
            txHash = await this.$libre.bank.requestRates({value: price});
        this.text = 'send Request Rates...'
        if (await this.$eth.isSuccess(txHash)) {
          this.text = "Request Rates tx is ok"
        } else {
          this.text = "Error when call requiest rates..."
        }
      } catch (err) {
        this.text = this.$eth.getErrorMsg(err)
      }
    },

    async calcRates() {
      try {
        let txHash = await this.$libre.bank.calcRates();

        this.text = 'send Calc Rates...'
        if (await this.$eth.isSuccess(txHash)) {
          this.text = "Calc Rates tx is ok"
        } else {
          this.text = "Error when call calc rates..."
        }
      } catch (err) {
        this.text = this.$eth.getErrorMsg(err)
      }
    },
  }
}
</script>