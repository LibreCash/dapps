<template>
    <div class="table-padding">
      <div class="level">
        <div class="card">
          <div class="card-content">
            <address-block></address-block>
          </div>
        </div>
      </div>
      <div class="level">
      <b-message :type="msg.type" style="white-space: wrap;">{{ msg.text }}</b-message>
      </div>
      <div class="level">
        <button class="button is-primary" v-bind:class="{'is-loading':isLoading}"
            @click="getTokens()" :disabled="isDisabled">{{ $t('lang.faucet.get-tokens') }}</button>
      </div>
    </div>
</template>

<script>
import AddressBlock from "@/components/AddressBlock";
import i18n from '../locales'
export default {
  data() {
    return {
      balanceLiberty: i18n.t('lang.common.loading-dots'),
      isLoading: false,
      msg: {
        type: "is-info",
        text: i18n.t('lang.common.loading-info-dots')
      },
      isDisabled: true
    };
  },

  methods: {
    async loadLiberty() {
      this.balanceLiberty = this.$libre.toToken(
          +await this.$libre.liberty.balanceOf(
            this.$eth._web3.eth.defaultAccount
          )
        )
        .toLocaleString();

      let balance = this.$libre.toToken(
          +await this.$libre.faucet.tokenBalance()
        ),
        isGot = await this.$libre.faucet.tokensSent(
          this.$eth._web3.eth.defaultAccount
        );

      if (!isGot && balance > 2000 && this.$eth._web3.eth.defaultAccount) {
        this.isDisabled = false;
        this.msg.text = i18n.t('lang.faucet.yes-you-can');
      } else if (!this.$eth._web3.eth.defaultAccount) {
        this.msg = {
          type: "is-danger",
          text: i18n.t('lang.common.no-metamask')
        };
      } else {
        this.msg = {
          type: "is-danger",
          text: isGot
            ? i18n.t('lang.faucet.already-sent')
            : i18n.t('lang.faucet.not-enough')
        };
      }
    },

    async getTokens() {
      this.isLoading = true;

      try {
        let txHash = await this.$libre.faucet.get();

        if (await this.$eth.isSuccess(txHash)) {
          this.$libre.notify(i18n.t('lang.faucet.tokens-sent'));

          this.loadLiberty();
        } else {
          this.$libre.notify(i18n.t('lang.faucet.error-sending'));
        }
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