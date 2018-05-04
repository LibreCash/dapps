<template>
    <div>
        <section v-if="this.defaultAddress">
            <div class="flex-mobile">
                <p>{{ $t('lang.common.your-address') }}: </p>
                <a :href="$libre.addressToLink(defaultAddress)" class="is-text-overflow">{{defaultAddress}}</a>
            </div>
            <div>
                {{ $t('lang.common.balances') }}: {{ balances.libre }} Libre, {{ balances.lbrs }} LBRS
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
            balances: {
                libre:0,
                lbrs:0
            },
            defaultAddress:null
        }
  },

  async created() {
    try{
        if(! window.web3.eth.defaultAccount ) {
            await this.$eth.accountPromise;
            await this.$libre.initPromise;
        }

        this.defaultAddress = window.web3.eth.defaultAccount;

        let balances = {
            libre:this.$libre.toToken(await this.$libre.token.balanceOf(this.defaultAddress)),
            lbrs:this.libertyBalance = this.$libre.toToken(await this.$libre.liberty.balanceOf(this.defaultAddress))
        }
            
    } catch(err) {
        console.log(err);
    }
  }
}
</script>