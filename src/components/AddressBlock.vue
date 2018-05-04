<template>
    <div>
        <section v-if="this.$eth.yourAccount">
            <div class="flex-mobile">
                <p>{{ $t('lang.common.your-address') }}: </p>
                <a :href="$libre.addressToLink(this.$eth.yourAccount)" class="is-text-overflow">{{this.$eth.yourAccount}}</a>
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
            await this.$eth.accountPromise;
            await this.$libre.initPromise;


        this.balances = {
            libre:this.$libre.toToken(await this.$libre.token.balanceOf(this.$eth.yourAccount)),
            lbrs:this.libertyBalance = this.$libre.toToken(await this.$libre.liberty.balanceOf(this.$eth.yourAccount))
        }
            
    } catch(err) {
        console.log(err);
    }
  }
}
</script>