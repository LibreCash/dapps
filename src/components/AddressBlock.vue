<template>
    <div>
        <section v-if="!unknownData">
            <div class="flex-mobile">
                <p>{{ $t('lang.common.your-address') }}: </p>
                <a :href="$libre.addressToLink(defaultAddress)" class="is-text-overflow flex-centered">{{defaultAddress}}</a>
            </div>
            <div>
                {{ $t('lang.common.balances') }}: {{ balance }} Libre, {{ libertyBalance }} LBRS
            </div>
        </section>
        <section v-else>
            <div>
                {{ $t('lang.common.no-metamask') }}
            </div>
        </section>
    </div>
</template>
<script>
export default {
    data() {
        return {
            unknownData: false,
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