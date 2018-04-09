<template>
  <form action="">
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Allowance</p>
        </header>
        <section class="modal-card-body">
            <b-notification :title="msg.title" :type="msg.type" :closable="false">
              {{ msg.text }}
            </b-notification>
            <b-field horizontal label="Approve:">
                <b-input :value="amount" v-model="amount" type="number" :placeholder="0" required></b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="close()">Close</button>
            <button class="button is-primary" @click="updateAllowance()">Allowance</button>
        </footer>
    </div>
  </form>
</template>

<script>
import Config from '@/config'
export default {
  props: ['defaultAmount', 'address','callback'],
  data() {
    return {
      amount: this.defaultAmount,
      msg: {
        type: '',
        text: 'Please set approve in field!'
      }
    }
  },
  methods: {
    async updateAllowance() {
      try {
        var txHash = await this.$libre.token.approve(this.address, this.amount * 10 ** this.$libre.consts.DECIMALS);

        this.msg = {
          type: 'is-info',
          text: 'Please wait...'
        }
        if (await this.$eth.isSuccess(txHash)) {
          this.msg = {
            type: 'is-success',
            text: 'Allowance set'
          }
          setTimeout(this.close, 3000);

          if (this.callback)
            this.callback();
        } else {
          this.msg = {
            type: 'is-warning',
            text: 'Creating offer error'
          }
        }
      } catch (err) {
        this.msg = {
          type: 'is-danger',
          text: this.$eth.getErrorMsg(err)
        }
      }
    },

    close() {
      this.$parent.close()
    }
  },
}
</script>