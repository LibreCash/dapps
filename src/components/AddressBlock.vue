<template>
    <div>
        <div class="address-block">
            Address: <a v-if="defaultAddress != 'Unknown'" :href="`https://rinkeby.etherscan.io/address/${defaultAddress}`">{{ defaultAddress }}</a>
            <span v-else>{{ defaultAddress }}</span>
        </div>
        <div v-if="balance > 0 || libertyBalance > 0">
            Balances: <span v-if="balance > 0">{{ balance }} Libre</span><span v-if="balance > 0 && libertyBalance > 0">,</span>
            <span v-if="libertyBalance > 0">{{ libertyBalance }} LBRS</span>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      defaultAddress: 'Unknown',
      balance: 0,
      libertyBalance:0
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