<template>
    <div>
      <div class="level"></div>
      <div class="table-padding">
        <div class="card">
          <div class="card-content">
            <div>{{ $t('lang.common.token-count') }}: {{ tokensCount }} LBRS</div>
            <div>{{ $t('lang.dao.min-to-vote') }}: {{ $libre.proposalParams.minBalance / 10 ** 18 }} LBRS</div>
            <div>{{ $t('lang.dao.min-count') }}: {{ $libre.proposalParams.quorum / 10 ** 18 }} LBRS</div>
            <div>{{ $t('lang.dao.min-deadline') }}: {{ $libre.proposalParams.minTime }}</div>
            <router-link :to="{ path: '/dao' }" class="button">
              <div class="icon">
                <i class="fas fa-arrow-left" size="is-small"></i>
              </div>
              <div>{{ $t('lang.common.back') }}</div>
            </router-link>
          </div>
        </div>
         
        <b-table :data="proposalData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="isLoading"
          :mobile-cards="true">
          <template slot-scope="props">
            <b-table-column :label="$t('lang.dao.name-row')">
              <strong>{{ props.row.name }}</strong>
            </b-table-column>
            <b-table-column :label="$t('lang.dao.status-row')" centered>
              {{ props.row.value }}
            </b-table-column>
          </template>
        </b-table>
        <div class="level"></div>
        <div class="level is-mobile" v-if="loggedIn">
          <div class="level-item has-text-centered">
            <button class="button is-success is-medium" v-on:click="vote(true)" :disabled="!enableVote"><i class="fas fa-thumbs-up"></i></button>
          </div>
          <div class="level-item has-text-centered">
            <button class="button is-danger is-medium" v-on:click="vote(false)" :disabled="!enableVote"><i class="fas fa-thumbs-down"></i></button>
          </div>
          <div class="level-item has-text-centered">
            <button v-bind:class="{'button is-medium is-info':true, 'is-loading': loadingExecute}"
              @click="execute()" :disabled="!enableExecute"><i class="fas fa-play"></i></button>
          </div>
          <div class="level-item has-text-centered">
            <button v-bind:class="{'button is-medium is-danger':true, 'is-loading': loadingBlock}"
                @click="block()"
                :disabled="!enableBlock">
              <i class="fas fa-ban"></i>
            </button>
          </div>
        </div>
        <div class="level"></div>
      </div>
    </div>
</template>

<script>
import Vue from 'vue'
import i18n from '../locales'
export default {
  data () {
    return {
      daoAddress: '',
      proposalId: this.$route.params.id,
      reportText: '',
      owner: false,
      proposalData: [],
      isLoading: false,
      isPaginated: true,
      isPaginationSimple: false,
      loggedIn: false,
      typeProposals: this.$libre.typeProposals,
      currentProposal: '',
      enableVote: false,
      contractOwner: false,
      deadline: '',
      enableExecute: false,
      enableBlock: false,
      loadingExecute: false,
      loadingBlock: false,
      tokensCount: ''
    }
  },
  methods: {
    async updateBlockTime() {
       this.proposalData.find(item => item.data === "now").rawValue = (+(await this.$eth.getLatestBlockTime()));
    },

    startUpdatingTime() {
      this.updatingTicker = setInterval(() => {
        if (this.proposalData.find(item => item.data === "now")) {
          this.proposalData.find(item => item.data === "now").rawValue++;
          this.proposalData.find(item => item.data === "now").value = new Date(this.getNow() * 1000).toLocaleString();
          this.updateEnabledButtons();
        }
      }, 1000);
      this.updatingBlockData = setInterval(() => {
        this.updateBlockTime()
      }, 10 * 60 * 1000 /* 10 minutes */);
    },

    updateEnabledButtons () {
      this.isActive = +this.proposal.status === this.$libre.proposalStatuses[0].number;
      this.enableVote = this.$eth.toTimestamp(this.votes.deadline) > this.getNow() * 1000 &&
                      !this.votes.voted &&
                      this.tokensCount >= this.$libre.proposalParams.minBalance / Math.pow(10, 18) &&
                      this.isActive;

      this.enableExecute = this.$eth.toTimestamp(this.votes.deadline) < this.getNow() * 1000 && 
          this.isActive &&
          (this.votes.yea > this.votes.nay) &&
          (this.votes.yea + this.votes.nay >= this.$libre.proposalParams.quorum / 10 ** 18);
      this.enableBlock = this.contractOwner && this.isActive;
    },

    getNow() {
      return this.proposalData.find(item => item.data === "now").rawValue;
    },

    clearTimers() {
      let intervals = [
        this.updatingTicker,
        this.updatingBlockData
      ];
      intervals.forEach((interval) => clearInterval(interval))
    },

    async getTokensCount () {
      await this.$libre.promiseLibre;
      this.tokensCount = +await this.$libre.liberty.balanceOf(this.defaultAddress) / 10 ** this.$libre.consts.DECIMALS;
    },

    async loadProposal () {
      this.loggedIn = (this.$eth._web3.eth.defaultAccount != undefined);
      const 
        struct = this.$libre.proposalStruct
    
      this.proposalData = []
      this.isLoading = true

      try {
          this.proposal = await this.$libre.updateProposal(this.$route.params.id),
          this.votes = this.proposal.vote;

          this.currentProposal = this.typeProposals[this.proposal.type]
          
          this.proposalData.push({
            name: i18n.t('lang.dao.type-row'),
            value: this.currentProposal.text
          })

          this.proposalData.push({
            name: i18n.t('lang.dao.status-row') + ':',
            value: this.$libre.proposalStatuses[+this.proposal.status].text
          })

          // Refactor it 
          if (this.currentProposal["benef"])
            this.proposalData.push({
              name: this.currentProposal["benef"], 
              value: this.$eth.isZeroAddress(this.proposal.recipient) ? '-' : this.proposal.recipient
            })
          
          if (this.currentProposal["amount"] || this.currentProposal["_amount"]) {
            let amount = this.proposal.amount;
            if (this.currentProposal["type"]) {
              if ((this.currentProposal["type"] == '%')) amount = `${this.proposal.amount / 100} %`;
              if ((this.currentProposal["type"] == 'bool')) amount = (this.proposal.amount === 1 ?
                                  i18n.t('lang.common.yes') : i18n.t('lang.common.no'));
            }
                          
            this.proposalData.push({
              name: this.currentProposal["amount"] || this.currentProposal["_amount"], 
              value: amount
            });
          }
          
          if (this.currentProposal["buf"]) {
            let buffer = (this.currentProposal["type"] && this.currentProposal["type"] == '%') ?
                          `${this.proposal.buffer / 100} %` : this.proposal.buffer;
            this.proposalData.push({
              name: this.currentProposal["buf"], 
              value: buffer
            });
          }

          if (this.currentProposal["code"]) {
            let byteString = this.$libre.bytecodeToString(this.proposal.recipient, this.proposal.bytecode);
            this.proposalData.push({
              name: this.currentProposal["code"], 
              value: byteString.length == 0 ? this.proposal.bytecode : byteString
            })
          }
            
          
          this.deadline = this.votes.deadline;

          this.proposalData.push(
            {name: i18n.t('lang.dao.voting-row'), value: `${this.votes.yea}/${this.votes.nay}`},
            {name: i18n.t('lang.dao.deadline-row'), value: new Date(this.votes.deadline * 1000).toLocaleString()},
            {name: i18n.t('lang.dao.now-row'), data: 'now', rawValue: 0, value: 0},
            {name: i18n.t('lang.dao.description-row'), value: this.proposal.description}
          )
          await this.updateBlockTime();
          this.updateEnabledButtons();

      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },

    async vote (support) {
      this.isLoading = true;

      try {
        let 
          txHash = await this.$libre.dao.vote(this.proposalId, support);
          
        this.$libre.notify(await this.$eth.isSuccess(txHash) ? i18n.t('lang.tx.vote.success') : i18n.t('lang.tx.vote.fail'));
        await this.$libre.updateProposal(this.proposalId)
        this.loadProposal()
        
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg,'is-danger');
      }
    },

    async checkOwner() {
      this.contractOwner = this.$eth.yourAccount === await this.$libre.dao.owner()
    },

    async execute() {
      this.loadingExecute = true;

      try {
        let txHash = await this.$libre.dao.executeProposal(this.$route.params.id)

        if (await this.$eth.isSuccess(txHash)) {
          this.$libre.notify(i18n.t('lang.tx.execute.success'));
        } else {
          this.$libre.notify(i18n.t('lang.tx.execute.fail'));
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg, 'is-danger');
      }
      
      this.loadingExecute = false;
      this.loadProposal();
    },

    async block() {
      this.loadingBlock = true

      try {
        let txHash = await this.$libre.dao.blockingProposal(this.$route.params.id);

        if (await this.$eth.isSuccess(txHash)) {
          this.$libre.notify(i18n.t('lang.tx.block.success'));
        } else {
          this.$libre.notify(i18n.t('lang.tx.block.fail'));
        }
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg,'is-danger');
      }
      this.loadingBlock = false;
      this.loadProposal();
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.daoAddress = Vue.config.libre.dao.address;
      this.defaultAddress = window.web3.eth.defaultAccount;
      await this.checkOwner();
      await this.getTokensCount();
      await this.loadProposal();
      this.selectedType = this.typeProposals[0];
      this.startUpdatingTime();
    } catch (err) {
      console.log(err)
    }
  },
  destroyed () {
    this.clearTimers();
  }
}
</script>

<style>
button.is-success {
  float: right;
}
</style>