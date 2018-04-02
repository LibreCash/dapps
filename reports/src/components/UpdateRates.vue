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
        this.message(this.text)
        if (await this.$eth.isSuccess(txHash)) {
          this.text = "Request Rates tx is ok"
          this.message(this.text)
        } else {
          this.text = "Error when call requiest rates..."
          this.message(this.text)
        }
      } catch (err) {
        this.text = this.$eth.getErrorMsg(err)
        this.message(this.text)
      }
    },

    async calcRates() {
      try {
        let txHash = await this.$libre.bank.calcRates();

        this.text = 'send Calc Rates...'
        this.message(this.text)
        if (await this.$eth.isSuccess(txHash)) {
          this.text = "Calc Rates tx is ok"
          this.message(this.text)
        } else {
          this.text = "Error when call calc rates..."
          this.message(this.text)
        }
      } catch (err) {
        this.text = this.$eth.getErrorMsg(err)
        this.message(this.text)
      }
    },

    message(msg) {
      this.$snackbar.open(msg);
      //this.$toast.open({message: msg, queue: true});
    }
  }
}
</script>