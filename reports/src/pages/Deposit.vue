<template>
  <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">Deposit</h2>
      </div>
      <br>
      <div class="table-padding">
        <router-link :to="{ path: '/deposit/new_deposit' }" class="button is-primary">New Deposit</router-link>
      </div>
    </section>
  </div>
</template>



<script>
export default {
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
  },

  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
    } catch (err) {
      console.log(err)
    }
  }
}
</script>