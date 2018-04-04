<template>
  <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">Deposit</h2>
      </div>
      <br>
      <div class="table-padding">
        
      </div>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
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
  created () {
    try {

    } catch (err) {
      console.log(err)
    }
  }
}
</script>