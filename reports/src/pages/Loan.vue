<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">{{ $route.params.type }} Loan #{{ $route.params.id }}</h2>
      </div>
      <br>
      <div class="table-padding">
        <button @click="$router.go(-1)" :to="{ path: '/loans' }" class="button">
          <b-icon icon="keyboard-return" size="is-small"></b-icon>
          <span>Back</span>
        </button>
        <span class="icon arrow-left"><i class="arrow-left"></i></span>
        <b-table :data="isEmpty ? [] : loanData"
          :bordered="isBordered"
          :striped="isStriped"
          :narrowed="isNarrowed"
          :loading="isLoading"
          :mobile-cards="hasMobileCards">
          <template slot-scope="props">
            <b-table-column>
              <strong>{{ props.row.name }}</strong>
            </b-table-column>
            <b-table-column centered>
              <input class="address" v-if="props.row.type == 'input'" type="text" :value="props.row.data" disabled="disabled" size="25">
              <span v-else>{{ props.row.data }}</span>
            </b-table-column>
          </template>
        </b-table>
        <br><br>
        <div class="columns">
          <div class="column">
            <button class="button is-success" v-on:click="loanAction('takeLoan')" :disabled="!takeEnable">Take</button>
          </div>
          <div class="column">
            <button class="button is-danger" v-on:click="loanAction('return')" :disabled="!returnEnable">Return</button>
          </div>
          <div class="column">
            <button class="button is-success" v-on:click="loanAction('claim')" :disabled="!claimEnable">Claim</button>
          </div>
          <div class="column">
            <button class="button is-danger" v-on:click="loanAction('cancel')" :disabled="!cancelEnable">Cancel</button>
          </div>
          <div class="column">
            <button class="button is-primary" v-on:click="isAllowanceActive = true">Allowance</button>
            <b-modal :active.sync="isAllowanceActive" has-modal-card>
              <allowance-modal v-bind="approve"></allowance-modal>
            </b-modal>
          </div>
          <div class="column">
            <button class="button is-primary" v-on:click="isUpdateRatesActive = true">Update Rates</button>
            <b-modal :active.sync="isUpdateRatesActive" has-modal-card>
              <update-rates></update-rates>
            </b-modal>
          </div>
        </div>
      </div>
      
    </section>
    </div>
</template>

<script>
import Config from '@/config'
import AllowanceModal from '@/components/AllowanceModal'
import UpdateRates from '@/components/UpdateRates'
export default {
  data () {
    return {
      loanId: this.$route.params.id,
      loanType: this.$route.params.type,
      loan: {},
      owner: false,
      loanData: [],
      isEmpty: false,
      isBordered: false,
      isStriped: true,
      isNarrowed: false,
      isLoading: false,
      hasMobileCards: true,
      isPaginated: false,
      isPaginationSimple: false,
      currentPage: 1,
      perPage: 5,
      takeEnable: false,
      returnEnable: false,
      claimEnable: false,
      cancelEnable: false,
      isAllowanceActive: false,
      approve: {
        address: Config.loans.address,
        amount: ''
      },
      isUpdateRatesActive: false
    }
  },
  methods: {
    async loadLoan () {
      this.loanData = []
      this.isLoading = true

      try {
          let 
            loan = this.$libre.getLoanObject(await this.$libre.loans[`getLoan${this.loanType == 'ETH' ? 'Eth' : 'Libre'}`](this.loanId));
            this.loan = loan;

          if (loan.status == 'active') {
            this.takeEnable = true;
            this.claimEnable = this.returnEnable = false;

            if (loan.holder === this.$eth.yourAccount)
              this.cancelEnable = true;
          } else if (loan.status == 'used') {
            this.takeEnable = this.cancelEnable = false;
            
            if (loan.holder === this.$eth.yourAccount)
              this.claimEnable = true;

            if (loan.recipient === this.$eth.yourAccount)
              this.returnEnable = true;
          }


          this.loanData.push({name: 'Type', data: this.$route.params.type})
          this.loanData.push({name: 'ID', data: this.$route.params.id})
          this.loanData.push({name: 'Holder', data: loan.holder, type: 'input'})

          if (loan.status != 'active') {
            this.loanData.push({name: 'Recipient', data: this.$eth.isZeroAddress(loan.recipient) ? '-' : loan.recipient, type: this.$eth.isZeroAddress(loan.recipient)? '':'input'})
            this.loanData.push({name: 'Take', data: new Date(loan.timestamp * 1000).toLocaleString()})
            this.loanData.push({name: 'Return', data: new Date((loan.timestamp + loan.period) * 1000).toLocaleString()})
          } else {
            this.loanData.push({name: 'Period', data: this.periodToString(loan.period)})
          }

          this.loanData.push({name: 'Amount', data: this.$eth.fromWei(loan.amount)})
          this.loanData.push({name: 'Margin', data: loan.margin})
          this.loanData.push({name: 'Refund', data: this.$eth.fromWei(loan.refund)})
          this.loanData.push({name: 'Status', data: loan.status})
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },

    periodToString(seconds) {
      var years = Math.floor(seconds / (60 * 60 * 24 * 365));
      seconds -= years * 60 * 60 * 24 * 365;

      var months = Math.floor(seconds / (60 * 60 * 24 * 30));
      seconds -= months * 60 * 60 * 24 * 30;

      var days = Math.floor(seconds / (60 * 60 * 24));
      seconds -= days * 60 * 60 * 24;

      var hours   = Math.floor(seconds / (60 * 60));
      seconds -= hours * 60 * 60;

      var minutes = Math.floor(seconds / 60);
      seconds -= minutes * 60;

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return `${years}y ${months}m ${days}d ${hours}:${minutes}:${seconds}`;
    },

    async loanAction(action) {
      try {
        let value = 0;
        if (action === 'takeLoan') {
          value = this.loanType == 'ETH' ? this.loan.amount : this.loan.pledge
          let allowance = +await this.$libre.token.allowance(this.myAddress, Config.loans.address)
        }

        let 
            txHash = await (this.$libre.loans[`${action}${this.loanType == 'ETH' ? 'Eth' : 'Libre'}`](this.loanId,{value: value})),
            message = (await this.$eth.isSuccess(txHash)) ? `${action} tx ok` : `${action} tx failed`
        //alert(message)
        this.message(message);
      }catch(e) {
        //alert(this.$eth.getErrorMsg(e))
        this.message(this.$eth.getErrorMsg(e));
      }
    },

    message(msg) {
      //this.$snackbar.open(msg);
      this.$toast.open({message: msg, queue: true});
    }
  },
  async created () {
    try {
      await this.$eth.loadAccounts();
      await this.$libre.init();
      this.loadLoan()
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    AllowanceModal,
    UpdateRates
  }
}
</script>