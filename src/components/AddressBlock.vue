<template>
    <div>
        <section v-show="$store.state.address">
            <div class="flex-mobile">
                <span>{{ $t('lang.common.your-address') }}:</span>
                <a :href="$libre.addressToLink($store.state.address)" class="is-text-overflow">{{ $store.state.address }}</a>
            </div>
            <div>
                {{ $t('lang.common.balances') }}: {{ $store.state.balances.eth }} ETH, {{ $store.state.balances.libre }} Libre, {{ $store.state.balances.lbrs }} LBRS
            </div>
            <div v-if="!hideTime">
                {{ $t('lang.common.current-time') }}: {{ $store.state.time == 0 ? '' : $d($store.state.time, 'long+') }}
            </div>
        </section>
        <section v-show="!$store.state.address">
            <div>
                {{ $t('lang.common.no-metamask') }}
            </div>
        </section>
    </div>
</template>
<script>
export default {
    props: ['hideCurrentTime'],
    data() {
        return {
            hideTime: this.hideCurrentTime
        }
    },

    async created() {
        try {
            await this.$eth.accountPromise;
            await this.$libre.initPromise;

            this.$store.dispatch('updateBalances', {
                libre: this.$libre.token.balanceOf,
                lbrs: this.$libre.liberty.balanceOf,
                eth: this.$eth.getBalance,
                ethConverter: this.$eth.fromWei,
                tokenConverter: this.$eth.toToken,
                address: this.$eth.loadAccounts
            })
        } catch(err) {
            console.log(err);
        }
    }
}
</script>