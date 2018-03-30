<template>
  <form action="">
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Allowance</p>
        </header>
        <section class="modal-card-body">
            <b-field label="Allowance:">
                <b-input :value="amount" type="number" :placeholder="amount" required></b-input>
            </b-field>
            <b-message :title="msg.title" :type="msg.type" :active.sync="msg.isActive">
              {{ msg.text }}
            </b-message>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="$parent.close()">Close</button>
            <button class="button is-primary" @click="updateAllowance()">Allowance</button>
        </footer>
    </div>
  </form>
</template>

<script>
import Config from '@/config'
export default {
  props: ['amount', 'address','callback'],
  data() {
    return {
      msg: {
        isActive: false,
        type: '',
        text: '',
        title: 'Warning'
      }
    }
  },
  methods: {
    async updateAllowance() {
      try {
        var txHash = await this.$libre.token.approve(this.address, this.amount * 10 ** this.$libre.consts.DECIMALS);

        this.msg = {
          type: 'is-info',
          text: 'Please wait...',
          isActive: true,
          title: 'Waiting...'
        }
        if (await this.$eth.isSuccess(txHash)) {
          this.msg = {
            type: 'is-success',
            text: 'Allowance set',
            isActive: true,
            title: 'Success'
          }

          if (this.callback)
            this.callback();
        } else {
          this.msg = {
            type: 'is-warning',
            text: 'Creating offer error',
            isActive: true,
            title: 'Warning'
          }
        }
      } catch (err) {
        this.msg = {
          type: 'is-danger',
          text: this.$eth.getErrorMsg(err),
          isActive: true,
          title: 'Error'
        }
    }
    }
  },
}
</script>