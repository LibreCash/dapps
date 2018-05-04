<template>
  <div>
      <div class="table-padding">
        <div class="card">
            <div class="card-content">
                <address-block/>
                <div>{{ $t('lang.common.max-amount') }}: {{ needAmount }} Libre</div>
                <div class="flex-mobile">{{ $t('lang.contracts.deposit') }}: <a class="is-text-overflow" :href="$libre.addressToLink(config.deposit.address)">{{ config.deposit.address }}</a></div>
                <div>{{ $t('lang.deposit.contract-available-balance') }}: {{ depositAvailable }} Libre</div>
            </div>
        </div>
        <div v-if="plans.isOwner">
          <div class="level"></div>
          <b-collapse class="card" :open="false">
            <div slot="trigger" slot-scope="props" class="card-header">
              <p class="card-header-title">{{ $t('lang.deposit.create-plan') }}</p>
              <a class="card-header-icon">
              0  <b-icon :icon="props.open ? 'caret-down' : 'caret-up'" icon-pack="fas"></b-icon>
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
                  <button class="button is-primary" :class="{'is-loading': plans.isCreating}" @click="createPlan()">
                    {{ $t('lang.deposit.create-plan') }}
                  </button>
                </b-field>
              </div>
            </div>
          </b-collapse>
        </div>
        <div class="level"></div>
        <h3 class="subtitle has-text-centered">{{ $t('lang.deposit.plans') }}</h3>
        <b-table :data="plans.data"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="plans.isLoading"
          :mobile-cards="true"
          :selected.sync="plans.selected">
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
          <b-field v-if="plans.selected">
            <b-input placeholder="0,00" v-model="amount"></b-input>
            <p class="control">
              <button class="button is-primary" :class="{'is-loading': deposit.isCreating}"
                  @click="newDeposit(plans.selected.id)"
                  :disabled="!newDepositEnable">{{ $t('lang.deposit.new-deposit') }}</button>
            </p>
          </b-field>
        </div>
        <div class="level"></div>
        <h3 class="subtitle has-text-centered" v-if="deposit.data.length > 0">{{ $t('lang.deposit.my-deposits') }}</h3>
        <b-table
          v-if="deposit.data.length > 0"
          :data="deposit.data"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="deposit.isLoading"
          :mobile-cards="true"
          :selected.sync="deposit.selected">
          <template slot-scope="props">
            <b-table-column label='ID' centered>
              {{ props.row.id }}
            </b-table-column>
            <b-table-column :label="$t('lang.deposit.start-time')" centered>
              {{ props.row.timestamp }}
            </b-table-column>
            <b-table-column :label="$t('lang.deposit.end-time')" centered>
              <p>{{ props.row.deadline }}</p>
              <p>
                <b-tag type="is-warning" v-if="props.row.ended">{{ $t('lang.deposit.ended') }}</b-tag>
                <b-tag type="is-info" v-if="!props.row.ended">{{ props.row.period }}</b-tag>
              </p>
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
        <button v-bind:class="{'button field is-danger':true, 'is-loading':deposit.isClaiming}"
                @click="claimDeposit(deposit.selected)"
                :disabled="!claimEnable" v-if="deposit.data.length > 0">
            {{ $t('lang.deposit.claim-deposit') }}
        </button>
      </div>
      <div class="level"></div>
      <div class="level"></div>
  </div>
</template>

<script>
import AddressBlock from '@/components/AddressBlock'
export default {
    data () {
        return {
            plans: {
                isOwner: false,
                isCreating: false,
                isLoading: true,
                data: [],
                selected: null
            },
            deposit: {
                isLoading: true,
                isClaiming: false,
                isCreating: false,
                data: [],
                selected: null
            },
            newPlan: {
                period: '',
                percent: '',
                minAmount: '',
                description: ''
            },
            amount: '',
            needAmount: '',
            msg: {
                type: 'is-info',
                notes: [this.$t('lang.deposit.tip-select-plan')]
            },
            balance: 0,
            depositAvailable: 0
        }
    },
    computed: {
        claimEnable() {
            return this.deposit.selected && this.deposit.selected.ended
        },
        newDepositEnable() {
            return +this.amount >= 0 && 
                   +this.amount >= this.plans.selected.minAmount &&
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
            this.plans.isCreating = true;

            try {
                let txHash = await this.$libre.deposit.createPlan(this.newPlan.period,this.newPlan.percent * this.$libre.consts.REVERSE_PERCENT,this.$libre.fromToken(this.newPlan.minAmount),this.newPlan.description);

                if (await this.$eth.isSuccess(txHash)) {
                    this.$libre.notify(this.$t('lang.deposit.tip-plan-created'));
                } else {
                    this.$libre.notify(this.$t('lang.common.transaction-failed'));
                }

                this.pushPlans(true);
            } catch(err) {
                let msg = this.$eth.getErrorMsg(err)
                console.log(msg)
                this.$libre.notify(msg,'is-danger');
            }

            this.plans.isCreating = false;
        },

        async approveLibre(amount) {
            let allowance = +await this.$libre.token.allowance(this.$eth.yourAccount, this.config.deposit.address),
                _waiting = this.$t('lang.common.tips.waiting'),
                _sending = this.$t('lang.common.tips.sending'),
                _success = this.$t('lang.common.success-low'),
                _fail = this.$t('lang.common.transaction-failed-low'),
                disclaimer = this.$t('lang.deposit.available-disclaimer'),
                authDisclaimer = this.$t('lang.deposit.authorize-disclaimer'),
                action = `1. ${authDisclaimer} ${this.$libre.toToken(amount)} Libre`;
            
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
            this.deposit.isCreating = true;

            try {
                if (!(await this.approveLibre(this.$libre.fromToken(this.amount))))
                  return
                let action = this.$t('lang.deposit.create-action'),
                    _waiting = this.$t('lang.common.tips.waiting'),
                    _sending = this.$t('lang.common.tips.sending'),
                    _success = this.$t('lang.common.success-low'),
                    _fail = this.$t('lang.common.transaction-failed-low');

                this.setMessage('warning', [`${action} - ${_waiting}`]);
                let txHash = await this.$libre.deposit.createDeposit(this.$libre.fromToken(this.amount), id);
                this.setMessage('warning', [`${action} - ${_sending}`]);

                if (await this.$eth.isSuccess(txHash)) {
                    this.setMessage('success', [`${action} - ${_success}`]);
                    this.$libre.notify(this.$t('lang.deposit.created'));
                    this.updateMyDeposit()
                } else {
                    this.setMessage('danger', [`${action} - ${_fail}`]);
                    this.$libre.notify(this.$t('lang.common.transaction-failed'));
                }
            } catch(err) {
                let msg = this.$eth.getErrorMsg(err)
                console.log(msg)
                this.$libre.notify(msg,'is-danger');
                this.msg.notes.push(msg);
            }

            this.deposit.isCreating = false;
            this.getBalances();
        },

        async claimDeposit(selectObject) {
            //this.deposit.selected = null
            this.deposit.isClaiming = true

            try {
                let txHash = await this.$libre.deposit.claimDeposit(selectObject.id);
                if (await this.$eth.isSuccess(txHash)) {
                    this.$snackbar.open(this.$t('lang.deposit.returned'));
                    this.updateMyDeposit()
                } else {
                    this.$libre.notify(this.$t('lang.common.transaction-failed'));
                }
            } catch(err) {
                let msg = this.$eth.getErrorMsg(err)
                console.log(msg)
                this.$libre.notify(msg,'is-danger');
            }

            this.deposit.isClaiming = false
        },

        async pushPlans (force = false) {
            this.plans.isLoading = true

            await this.$libre.loadPlans(force);
            this.plans.data = [];

            this.$libre.plans.forEach((plan) => {
                this.plans.data.push({
                    id: plan.id,
                    description: plan.description,
                    percent: plan.percent / this.$libre.consts.REVERSE_PERCENT,
                    period: this.$libre.periodToString(plan.period),
                    minAmount: this.$libre.toToken(plan.minAmount)
                })
            })

            this.plans.isLoading = false
        },

        async updateMyDeposit() {
            await this.getBalances()
            this.deposit.data = []
            this.deposit.isLoading = true;

            let count = +await this.$libre.deposit.myDepositLength();
            for (let i=0; i < count; i++) {
                let deposit = this.$libre.getDepositObject(await this.$libre.deposit.deposits(window.web3.eth.defaultAccount, i));

                if (deposit.timestamp == 0) 
                    continue

                let now = new Date(),
                    deadline = new Date(deposit.deadline * 1000),
                    ended = false,
                    period = 0;

                if (now < deadline)
                    period = this.$libre.periodToString(Math.floor((deadline - now)/1000));
                else {
                    ended = true;
                }

                this.deposit.data.push({
                    id: i,
                    timestamp: this.$d(deposit.timestamp * 1000, 'long+'),
                    deadline: this.$d(deadline, 'long+'),
                    ended: ended,
                    period: period,
                    amount: this.$libre.toToken(deposit.amount),
                    margin: this.$libre.toToken(deposit.margin),
                    plan: deposit.plan
                })
            }

            this.deposit.isLoading = false
        },

        async checkOwner() {
            this.plans.isOwner = this.$eth.yourAccount == await this.$libre.deposit.owner();
        },

        async calcProfit(amount, id) {
            if (amount < this.plans.selected.minAmount)
                this.setMessage("warning", [this.$t('lang.deposit.low-amount-disclaimer')]);
            else if (amount > this.needAmount)
                this.setMessage("warning", [this.$t('lang.deposit.over-amount-disclaimer')]);
            else if (await this.$libre.deposit.calcProfit(this.$libre.fromToken(amount), id) / 10 ** 18 > this.depositAvailable)
                this.setMessage("warning", [this.$t('lang.deposit.over-possibilities')]);
            else
                this.setMessage("info", [`${this.$t('lang.deposit.income')}: ${this.$libre.toToken(await this.$libre.deposit.calcProfit(this.$libre.fromToken(amount), id))} Libre`]);
        },

        async getBalances() {
            this.balance = this.$libre.toToken(await this.$libre.token.balanceOf(this.$eth.yourAccount));
            this.depositAvailable = this.$libre.toToken(await this.$libre.deposit.availableTokens());
            this.needAmount = this.$libre.toToken(await this.$libre.deposit.needAmount());
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
        amount: function(newVal) {this.calcProfit(newVal, this.plans.selected.id)},
        plans: function(newVal, oldVal) {this.calcProfit(this.amount, newVal.selected.id)}
    },
    components: {
        AddressBlock
    }
}
</script>