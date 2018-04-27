<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: ['coins'],
  methods: {
    updateData() {
      if (!this.coins)
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
    coins(newVal, oldVal) {
      this.updateData()
    }
  }
}
</script>
