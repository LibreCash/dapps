<template>
  <div>
      <div class="table-padding">
        <div class="card">
            <div class="card-content">
                <address-block/>
                <div>{{ $t('lang.common.max-amount') }}: {{ needAmount }} Libre</div>
                <div class="flex">{{ $t('lang.contracts.deposit') }}: <a class="address is-text-overflow" :href="$libre.addressToLink(deposit)">{{ deposit }}</a></div>
            </div>
        </div>
        <div v-if="owner">
          <div class="level"></div>
          <b-collapse class="card" :open="false">
            <div slot="trigger" slot-scope="props" class="card-header">
              <p class="card-header-title">{{ $t('lang.deposit.create-plan') }}</p>
              <a class="card-header-icon">
                <b-icon :icon="props.open ? 'caret-down' : 'caret-up'" icon-pack="fas"></b-icon>
              </a>
            </div>
            <div class="card-content">
              <div class="content">
                <b-field horizontal :label="$t('lang.deposit.period')">
                  <b-field :message="$libre.periodToString(newPlan.period)">
                    <b-input v-model="newPlan.period"></b-input>
                  </b-field> 
                </b-field>
                <b-field horizontal :label="$t('lang.deposit.percent-label')">
                  <b-input v-model="newPlan.percent"></b-input>
                </b-field>
                <b-field horizontal :label="$t('lang.deposit.min-amount-label')">
                  <b-input v-model="newPlan.minAmount"></b-input>
                </b-field>
                <b-field horizontal :label="$t('lang.deposit.description')">
                  <b-input v-model="newPlan.description"></b-input>
                </b-field>
                <b-field horizontal>
                  <button class="button is-primary" :class="{'is-loading': newPlanLoading}" @click="createPlan()">
                    {{ $t('lang.deposit.create-plan') }}
                  </button>
                </b-field>
              </div>
            </div>
          </b-collapse>
        </div>
        <div class="level"></div>
        <h3 class="subtitle has-text-centered">{{ $t('lang.deposit.plans') }}</h3>
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
            <b-table-column :label="$t('lang.common.description')">
              <strong>{{ props.row.description }}</strong>
            </b-table-column>
            <b-table-column :label="$t('lang.deposit.percent-label')">
              <strong>{{ props.row.percent }}</strong>
            </b-table-column>
            <b-table-column :label="$t('lang.common.period')" centered>
              {{ props.row.period }}
            </b-table-column>
            <b-table-column :label="$t('lang.deposit.min-amount-label')" centered>
              {{ props.row.minAmount }}
            </b-table-column>
          </template>
        </b-table>
        <div class="level"></div>
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
              <button v-bind:class="{'button is-primary':true, 'is-loading':newDepositLoading}"
                  @click="newDeposit(planSelected.id)"
                  :disabled="!newDepositEnable">{{ $t('lang.deposit.new-deposit') }}</button>
            </p>
          </b-field>
        </div>
        <div class="level"></div>
        <h3 class="subtitle has-text-centered" v-if="myDepositData.length > 0">{{ $t('lang.deposit.my-deposits') }}</h3>
        <b-table
          v-if="myDepositData.length > 0"
          :data="myDepositData"
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
            <b-table-column :label="$t('lang.deposit.start-time')" centered>
              {{ props.row.timestamp }}
            </b-table-column>
            <b-table-column :label="$t('lang.common.deadline')" centered>
              {{ props.row.deadline }}
            </b-table-column>
            <b-table-column :label="$t('lang.deposit.amount-libre')" centered>
              {{ props.row.amount }}
            </b-table-column>
            <b-table-column :label="$t('lang.deposit.margin-libre')" centered>
              {{ props.row.margin }}
            </b-table-column>
            <b-table-column :label="$t('lang.deposit.plan')" centered>
              {{ props.row.plan }}
            </b-table-column>
          </template>
        </b-table>
        <div class="level"></div>
        <button v-bind:class="{'button field is-danger':true, 'is-loading':isClaimLoading}"
                @click="claimDeposit(selected)"
                :disabled="!claimEnable" v-if="myDepositData.length > 0">
            {{ $t('lang.deposit.claim-deposit') }}
        </button>
      </div>
      <div class="level"></div>
      <div class="level"></div>
  </div>
</template>

<script>
import AddressBlock from '@/components/AddressBlock'
import i18n from '../locales'
export default {
  data () {
    return {
      deposit: this.config.deposit.address,
      isLoading: false,
      newPlanLoading: false,
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
        notes: [i18n.t('lang.deposit.tip-select-plan')]
      },
      balance: 0
    }
  },
  computed: {
    claimEnable() {
        return this.selected && this.selected.deadline.search(i18n.t('lang.common.outdated')) > 0
    },
    newDepositEnable() {
        return +this.amount >= 0 && 
               +this.amount >= this.planSelected.minAmount &&
               +this.amount < this.balance
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
        this.newPlanLoading = true;
        let txHash = await this.$libre.deposit.createPlan(this.newPlan.period,this.newPlan.percent * this.$libre.consts.REVERSE_PERCENT,this.$libre.fromToken(this.newPlan.minAmount),this.newPlan.description);
        if (await this.$eth.isSuccess(txHash)) {
          this.$libre.notify(i18n.t('lang.deposit.tip-plan-created'));
        } else {
          this.$libre.notify(i18n.t('lang.common.transaction-failed'));
        }
        this.pushPlans(true);
        this.newPlanLoading = false;
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg,'is-danger');
      }
    },

    async approveLibre(amount) {
      let allowance = +await this.$libre.token.allowance(this.$eth.yourAccount, this.config.deposit.address);
      let _waiting = i18n.t('lang.common.tips.waiting'),
          _sending = i18n.t('lang.common.tips.sending'),
          _success = i18n.t('lang.common.success-low'),
          _fail = i18n.t('lang.common.transaction-failed-low');
      let disclaimer = i18n.t('lang.deposit.available-disclaimer'),
          authDisclaimer = i18n.t('lang.deposit.authorize-disclaimer');
      let action = `1. ${authDisclaimer} ${this.$libre.toToken(amount)} Libre`;
      if (allowance < amount) {
        this.setMessage('warning', [disclaimer, `${action} - ${_waiting}`]);
        let txHash = await this.$libre.token.approve(this.config.deposit.address, amount);
        this.setMessage('warning', [disclaimer, `${action} - ${_sending}`]);
        if (await this.$eth.isSuccess(txHash)) {
          this.setMessage('success', [disclaimer, `${action} - ${_success}`]);
        } else {
          this.setMessage('danger', [disclaimer, `${action} - ${_fail}`]);
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
        let action = i18n.t('lang.deposit.create-action');
        let _waiting = i18n.t('lang.common.tips.waiting'),
          _sending = i18n.t('lang.common.tips.sending'),
          _success = i18n.t('lang.common.success-low'),
          _fail = i18n.t('lang.common.transaction-failed-low');

        this.setMessage('warning', [`${action} - ${_waiting}`]);
        let txHash = await this.$libre.deposit.createDeposit(this.$libre.fromToken(this.amount),id);
        this.setMessage('warning', [`${action} - ${_sending}`]);
        if (await this.$eth.isSuccess(txHash)) {
          this.setMessage('success', [`${action} - ${_success}`]);
          this.$libre.notify(i18n.t('lang.deposit.created'));
          this.updateMyDeposit()
        } else {
          this.setMessage('danger', [`${action} - ${_fail}`]);
          this.$libre.notify(i18n.t('lang.common.transaction-failed'));
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg,'is-danger');
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
          this.$snackbar.open(i18n.t('lang.deposit.returned'));
          this.updateMyDeposit()
        } else {
          this.$libre.notify(i18n.t('lang.common.transaction-failed'));
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg,'is-danger');
      }
      this.isClaimLoading = false
    },

    async pushPlans (force = false) {
      await this.$libre.loadPlans(force);
      this.plansData = [];
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
      this.isloadingDeposit = true;

      let 
        count = +await this.$libre.deposit.myDepositLength(),
        i;

      for(i = 0; i < count;i++) {
        let 
          deposit = this.$libre.getDepositObject(await this.$libre.deposit.deposits(window.web3.eth.defaultAccount,i));

        if (deposit.timestamp == 0) 
          continue

        let deadline = new Date(deposit.deadline * 1000),
            now = new Date();

        if (now < deadline)
          deadline = `${i18n.d(deadline, 'long+')} (${this.$libre.periodToString(Math.floor((deadline - now)/1000))})`
        else
          deadline = `${i18n.d(deadline, 'long+')} (${i18n.t('lang.common.outdated')})`

        this.myDepositData.push({
          id: i,
          timestamp: i18n.d(deposit.timestamp * 1000, 'long+'),
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
        this.setMessage("warning", [i18n.t('lang.deposit.low-amount-disclaimer')]);
      else if (amount > this.needAmount)
        this.setMessage("warning", [i18n.t('lang.deposit.over-amount-disclaimer')]);
      else
        this.setMessage("info", [`${i18n.t('lang.deposit.income')}: ${this.$libre.toToken(await this.$libre.deposit.calcProfit(this.$libre.fromToken(amount), id))} Libre`]);
    },

    async getBalance() {
        this.balance = this.$libre.toToken(await this.$libre.token.balanceOf(window.web3.eth.defaultAccount))
    }
  },

  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.checkOwner();
      this.pushPlans();
      this.updateMyDeposit();
      this.getBalance();
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