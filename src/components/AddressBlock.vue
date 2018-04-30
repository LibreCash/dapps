<template>
    <div>
        <section v-if="!unknownData">
            <div class="flex">
                <p>Your address:</p>
                <a :href="addressToLink(defaultAddress)" class="is-text-overflow">{{defaultAddress}}</a>
            </div>
            <div>
                Balances: {{ balance }} Libre, {{ libertyBalance }} LBRS
            </div>
        </section>
        <section v-else>
            <div>
                No metamask / not logged in
            </div>
        </section>
    </div>
</template>
<script>
import Vue from 'vue'
export default {
    data() {
        return {
            unknownData: false,
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
            this.unknownData = true;
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