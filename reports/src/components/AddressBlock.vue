<template>
  <div class="address-block">Address: {{ defaultAddress }}</div>
</template>

<script>
export default {
  data() {
    return {
      defaultAddress: 'Unknown'
    }
  },
  async created() {
    await this.$eth.accountPromise;
    await this.$libre.initPromise;
    this.defaultAddress = window.web3.eth.defaultAccount;
  }
}
</script>