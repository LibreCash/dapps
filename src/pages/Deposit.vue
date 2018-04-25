<template>
  <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">Deposit</h2>
      </div>
      <div class="level"></div>
      <div class="table-padding">
        <div class="card">
            <div class="card-content">
                <address-block/>
                <div>Max amount: {{ needAmount }} Libre</div>
            </div>
        </div>
        <div v-if="owner">
          <b-collapse class="card" :open="false">
            <div slot="trigger" slot-scope="props" class="card-header">
              <p class="card-header-title">Create Plan</p>
              <a class="card-header-icon">
                <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
              </a>
            </div>
            <div class="card-content">
              <div class="content">
                <div>Address Deposit contract: {{ deposit }}</div><br>
                <b-field horizontal label="Period, sec">
                  <b-field :message="$libre.periodToString(newPlan.period)">
                    <b-input v-model="newPlan.period"></b-input>
                  </b-field> 
                </b-field>
                <b-field horizontal label="Percent, %">
                  <b-input v-model="newPlan.percent"></b-input>
                </b-field>
                <b-field horizontal label="Min amount, Libre">
                  <b-input v-model="newPlan.minAmount"></b-input>
                </b-field>
                <b-field horizontal label="Description">
                  <b-input v-model="newPlan.description"></b-input>
                </b-field>
                <b-field horizontal>
                  <button class="button is-primary" @click="createPlan()">Create Plan</button>
                </b-field>
              </div>
            </div>
          </b-collapse>
          <br>
        </div>
        <br>
        <h3 class="subtitle has-text-centered">Plans</h3>
        <b-table :data="plansData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="isloadingPlans"
          :mobile-cards="true"
          :selected.sync="planSelected">
          <template slot-scope="props">
            <b-table-column label='ID'>
              <strong>{{ props.row.id }}</strong>
            </b-table-column>
            <b-table-column label='Description'>
              <strong>{{ props.row.description }}</strong>
            </b-table-column>
            <b-table-column label='Percent, %'>
              <strong>{{ props.row.percent }}</strong>
            </b-table-column>
            <b-table-column label='Period' centered>
              {{ props.row.period }}
            </b-table-column>
            <b-table-column label='Min Amount, Libre' centered>
              {{ props.row.minAmount }}
            </b-table-column>
          </template>
        </b-table>
        <br>
        <div>
          <b-field>
            <b-message :type="msg.type" style="white-space: wrap;">
              <p v-for="note in msg.notes">
                {{ note }}
              </p>
            </b-message>
          </b-field>
          <b-field v-if="planSelected">
            <b-input placeholder="0,00" v-model="amount"></b-input>
            <p class="control">
              <button v-bind:class="{'button is-primary':true, 'is-loading':newDepositLoading}" @click="newDeposit(planSelected.id)" :disabled="amount < planSelected.minAmount">New Deposit</button>
            </p>
          </b-field>
        </div>
        <hr>
        <br>
        <h3 class="subtitle has-text-centered" v-if="myDepositData.length > 0">My Deposits</h3>
        <b-table :data="myDepositData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="isloadingDeposit"
          :mobile-cards="true"
          :selected.sync="selected">
          <template slot-scope="props">
            <b-table-column label='ID' centered>
              {{ props.row.id }}
            </b-table-column>
            <b-table-column label='Time start' centered>
              {{ props.row.timestamp }}
            </b-table-column>
            <b-table-column label='Deadline' centered>
              {{ props.row.deadline }}
            </b-table-column>
            <b-table-column label='Amount, Libre' centered>
              {{ props.row.amount }}
            </b-table-column>
            <b-table-column label='Margin, Libre' centered>
              {{ props.row.margin }}
            </b-table-column>
            <b-table-column label='Plan' centered>
              {{ props.row.plan }}
            </b-table-column>
          </template>
        </b-table>
        <br>
        <button v-bind:class="{'button field is-danger':true, 'is-loading':isClaimLoading}" @click="claimDeposit(selected)"
            :disabled="!selected" v-if="myDepositData.length > 0">
            <span>Claim Deposit</span>
        </button>
      </div>
      <br><br>
    </section>
  </div>
</template>

<script>
import Config from '@/config'
import AddressBlock from '@/components/AddressBlock'
export default {
  data () {
    return {
      deposit: Config.deposit.address[this.$eth.network],
      isLoading: false,
      owner: false,
      plansData: [],
      isloadingPlans: true,
      myDepositData: [],
      isloadingDeposit: true,
      selected: null,
      planSelected: null,
      isClaimLoading: false,
      newPlan: {
        period: '',
        percent: '',
        minAmount: '',
        description: ''
      },
      newDepositLoading: false,
      amount: '',
      needAmount: '',
      msg: {
        type: 'is-info',
        notes: ['Select plan to create deposit!']
      }
    }
  },
  methods: {
    setMessage(type, notes) {
      this.msg = {
        type: `is-${type}`,
        notes: notes
      }
    },

    async createPlan() {
      try {
        let txHash = await this.$libre.deposit.createPlan(this.newPlan.period,this.newPlan.percent * this.$libre.consts.REVERSE_PERCENT,this.$libre.fromToken(this.newPlan.minAmount),this.newPlan.description);
        if (await this.$eth.isSuccess(txHash)) {
          this.$snackbar.open('New plan created!');
        } else {
          this.$snackbar.open('Transaction failed!');
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$snackbar.open(msg);
      }
    },

    async approveLibre(amount) {
      let allowance = +await this.$libre.token.allowance(this.$eth.yourAccount, Config.deposit.address[this.$eth.network]);
      let disclaimer = 'Available amount for deposit:';
      let action = `1. Authorize the transfer ${this.$libre.toToken(amount)} Libre tokens`;
      if (allowance < amount) {
        this.setMessage('warning', [disclaimer, `${action} - waiting for confirmations...`]);
        let txHash = await this.$libre.token.approve(Config.deposit.address[this.$eth.network], amount);
        this.setMessage('warning', [disclaimer, `${action} - sending to the network...`]);
        if (await this.$eth.isSuccess(txHash)) {
          this.setMessage('success', [disclaimer, `${action} - success`]);
        } else {
          this.setMessage('danger', [disclaimer, `${action} - transaction failed`]);
          return false;
        }
      }
      return true;
    },

    async newDeposit(id) {
      this.newDepositLoading = true;
      try {
        if (!(await this.approveLibre(this.$libre.fromToken(this.amount))))
          return
        let action = 'Creating new deposit ';

        this.setMessage('warning', [`${action} - waiting for confirmations...`]);
        let txHash = await this.$libre.deposit.createDeposit(this.$libre.fromToken(this.amount),id);
        this.setMessage('warning', [`${action} - sending to the network...`]);
        if (await this.$eth.isSuccess(txHash)) {
          this.setMessage('success', [`${action} - success`]);
          this.$snackbar.open('New deposit created!');
          this.updateMyDeposit()
        } else {
          this.setMessage('danger', [`${action} - transaction failed`]);
          this.$snackbar.open('Transaction failed!');
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$snackbar.open(msg);
        this.msg.notes.push(msg);
      }
      this.newDepositLoading = false;
    },

    async claimDeposit(selectObject) {
      this.selected = null
      this.isClaimLoading = true
      try {
        let txHash = await this.$libre.deposit.claimDeposit(selectObject.id);
        if (await this.$eth.isSuccess(txHash)) {
          this.$snackbar.open('Deposit returned!');
          this.updateMyDeposit()
        } else {
          this.$snackbar.open('Transaction failed!');
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$snackbar.open(msg);
      }
      this.isClaimLoading = false
    },

    async pushPlans() {
      await this.$libre.loadPlans();
      this.$libre.plans.forEach((plan) => {
        this.plansData.push({
          id: plan.id,
          description: plan.description,
          percent: plan.percent / this.$libre.consts.REVERSE_PERCENT,
          period: this.$libre.periodToString(plan.period),
          minAmount: this.$libre.toToken(plan.minAmount)
        })
      })
      this.isloadingPlans = false
    },

    async updateMyDeposit() {
      this.needAmount = this.$libre.toToken(await this.$libre.deposit.needAmount());
      this.myDepositData = []
      this.isloadingDeposit = true;

      let count = +await this.$libre.deposit.myDepositCount();
      for(let i=0; i < count;i++) {
        let deposit = this.$libre.getDepositObject(await this.$libre.deposit.deposits(window.web3.eth.defaultAccount,i));

        if (deposit.timestamp == 0) 
          continue

        let deadline = new Date(deposit.deadline * 1000),
            now = new Date();

        if (now < deadline)
          deadline = `${deadline.toLocaleString()} (${this.$libre.periodToString(Math.floor((deadline - now)/1000))})`
        else
          deadline = `${dealine.toLocaleString()} (outdated)`

        this.myDepositData.push({
          id: i,
          timestamp: new Date(deposit.timestamp * 1000).toLocaleString(),
          deadline: deadline,
          amount: this.$libre.toToken(deposit.amount),
          margin: this.$libre.toToken(deposit.margin),
          plan: deposit.plan
        })
      }
      
      this.isloadingDeposit = false
    },

    async checkOwner() {
      this.owner = window.web3.eth.defaultAccount == await this.$libre.deposit.owner();
    },

    async calcProfit(amount, id) {
      if (amount < this.planSelected.minAmount)
        this.setMessage("warning", ["Amount is less than min amount in the selected plan"]);
      else if (amount > this.needAmount)
        this.setMessage("warning", ["Amount is bigger than max amount"]);
      else
        this.setMessage("info", [`Income: ${this.$libre.toToken(await this.$libre.deposit.calcProfit(this.$libre.fromToken(amount), id))} Libre`]);
    }
  },

  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.checkOwner();
      this.pushPlans();
      this.updateMyDeposit();
    } catch (err) {
      console.log(err)
    }
  },
  watch: {
    amount: function(newVal) {this.calcProfit(newVal, this.planSelected.id)},
    planSelected: function(newVal) {this.calcProfit(this.amount, newVal.id)}
  },
  components: {
    AddressBlock
  }
}
</script>