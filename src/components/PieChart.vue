<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: ['coins'],
  methods: {
    updateData() {
      console.log("Hello",this.coins);
      if (!this.coins[0].balanceUSD)
        return;

      this.renderChart({
        labels: this.coins.map(coin => coin.name),
        datasets: [
          {
            label: 'GitHub Commits',
            backgroundColor: ['#ff3300','#3366ff','#33cc33','#999966','#ff9933','#ff3399'],
            data: this.coins.map(coin => coin.balanceUSD)
          }
        ]
      })
    }
  },
  mounted () {
    this.updateData()
  },
  watch: {
    '$props': {
      handler: function(newVal, oldVal) {
        console.log("Update")
        this.updateData()
      },
      deep: true
    }
  }
}
</script>
