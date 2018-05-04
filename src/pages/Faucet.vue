<template>
    <div class="table-padding">
      <div class="card level">
        <div class="card-content">
          <address-block></address-block>
        </div>
      </div>
      <b-message :type="msg.type">{{ msg.text }}</b-message>
      <div class="level">
        <div class="flex level-item">
            <button class="button is-primary is-large" v-bind:class="{'is-loading':isLoading}"
            @click="getTokens()" :disabled="isDisabled">{{ $t('lang.faucet.get-tokens') }}</button>
        </div>
      </div>
    </div>
</template>

<script>
import AddressBlock from "@/components/AddressBlock";
export default {
  data() {
    return {
      balanceLiberty: this.$t('lang.common.loading-dots'),
      isLoading: false,
      msg: {
        type: "is-info",
        text: this.$t('lang.common.loading-info-dots')
      },
      isDisabled: true
    };
  },

  methods: {
    async loadLiberty() {
      this.balanceLiberty = this.$libre.toToken(
          +await this.$libre.liberty.balanceOf(
            this.$eth.yourAccount
          )
        )
        .toLocaleString();

      let balance = this.$libre.toToken(
          +await this.$libre.faucet.tokenBalance()
        ),
        isGot = await this.$libre.faucet.tokensSent(
          this.$eth.yourAccount
        );

      if (!isGot && balance > 2000 && this.$eth.yourAccount) {
        this.isDisabled = false;
        this.msg.text = this.$t('lang.faucet.yes-you-can');
      } else if (!this.$eth.yourAccount) {
        this.msg = {
          type: "is-danger",
          text: this.$t('lang.common.no-metamask')
        };
      } else {
        this.msg = {
          type: "is-danger",
          text: isGot
            ? this.$t('lang.faucet.already-sent')
            : this.$t('lang.faucet.not-enough')
        };
      }
    },

    async getTokens() {
      this.isLoading = true;

      try {
        let txHash = await this.$libre.faucet.get();

        if (await this.$eth.isSuccess(txHash)) {
          this.$libre.notify(this.$t('lang.faucet.tokens-sent'));

          this.loadLiberty();
        } else {
          this.$libre.notify(this.$t('lang.faucet.error-sending'));
        }
        this.isDisabled = true;
      } catch (err) {
        let msg = this.$eth.getErrorMsg(err);
        console.log(msg);
        this.$libre.notify(msg,'is-danger');
      }
      
      this.isLoading = false;
    }
  },

  async created() {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.loadLiberty();
    } catch (err) {
      console.log(err);
    }
  },

  components: {
    AddressBlock
  }
};
</script>