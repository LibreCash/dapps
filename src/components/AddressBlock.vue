<template>
    <div>
        <div class="address-block">
            Your address: <a v-if="defaultAddress != 'Unknown'" :href="addressToLink(defaultAddress)"><input class="address" :value="defaultAddress"></a>
            <span v-else><input class="address" :value="defaultAddress"></span>
        </div>
        <div>
            Balances: {{ balance }} Libre, {{ libertyBalance }} LBRS
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      defaultAddress: 'Unknown',
      balance: 0,
      libertyBalance:0,
      addressToLink: Vue.config.libre.addressToLink
    }
  },

  async created() {
    try{
        await this.$eth.accountPromise;
        await this.$libre.initPromise;
        this.defaultAddress = window.web3.eth.defaultAccount;
        if (this.defaultAddress == undefined) {
            this.balance = "Unknown"
            this.defaultAddress = "Unknown"
            this.libertyBalance = "Unknown"
        } else {
            this.balance = this.$libre.toToken(await this.$libre.token.balanceOf(this.defaultAddress))
            this.libertyBalance = this.$libre.toToken(await this.$libre.liberty.balanceOf(this.defaultAddress))
        }
    } catch(err) {
        console.log(err);
    }
  }
}
</script>