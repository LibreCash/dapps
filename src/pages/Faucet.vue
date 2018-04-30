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
            @click="getTokens()" :disabled="isDisabled">Get Tokens</button>
      </div>
    </div>
</template>

<script>
import AddressBlock from "@/components/AddressBlock";

export default {
  data() {
    return {
      balanceLiberty: "loading...",
      isLoading: false,
      msg: {
        type: "is-info",
        text: "Loading information..."
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
        this.msg.text = "You can get LBRS.";
      } else if (!this.$eth._web3.eth.defaultAccount) {
        this.msg = {
          type: "is-danger",
          text: "No metamask / not logged in"
        };
      } else {
        this.msg = {
          type: "is-danger",
          text: isGot
            ? "Tokens have already been sent to the address"
            : "Not enough tokens on the faucet"
        };
      }
    },

    async getTokens() {
      this.isLoading = true;

      try {
        let txHash = await this.$libre.faucet.get();

        if (await this.$eth.isSuccess(txHash)) {
          this.$libre.notify("Tokens sent");

          this.loadLiberty();
        } else {
          this.$libre.notify("Error sending token transaction");
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