<template>
    <div>
      <div class="level"></div>
      <div class="table-padding">
        <div class="card">
          <div class="card-content">
            <address-block></address-block>
            <div> {{$t('lang.dao.now-row')}}  {{ now }}</div>
            <div>{{ $t('lang.dao.min-to-vote') }}: {{ $libre.toToken($libre.proposalParams.minBalance) }} LBRS</div>
            <div>{{ $t('lang.dao.min-count') }}: {{ $libre.toToken($libre.proposalParams.quorum) }} LBRS</div>
            <div>{{ $t('lang.dao.min-deadline', {period: $libre.proposalParams.minTime}) }}</div>
            <div class="level"></div>
            <router-link :to="{ path: '/dao' }" class="button">
              <div class="icon">
                <i class="fas fa-arrow-left" size="is-small"></i>
              </div>
              <div>{{ $t('lang.common.back') }}</div>
            </router-link>
          </div>
        </div>
        <div class="level"></div>
          <div class="card-content table-padding"> 
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
            <td v-if="$eth.isAddress(props.row.value)" :data-label="$t('lang.common.value-row')" class="flex-mobile">
              <a :href="$libre.addressToLink(props.row.value)" class="is-text-overflow">{{ props.row.value }}</a>
            </td>
            <b-table-column v-else :label="$t('lang.dao.value-row')" >
              {{ props.row.value }}
            </b-table-column>
          </template>
        </b-table>
        </div>

        <div class="level"></div>
        <div class="level is-mobile">
            <div class="level-item has-text-centered">
                <button class="button is-success is-medium" v-on:click="vote(true)" :disabled="!enableVote"><i class="fas fa-thumbs-up"></i></button>
            </div>
            <div class="level-item has-text-centered">
                <button class="button is-danger is-medium" v-on:click="vote(false)" :disabled="!enableVote"><i class="fas fa-thumbs-down"></i></button>
            </div>
            <div class="level-item has-text-centered">
                <button class="button is-medium is-info" :class="{'is-loading': loadingExecute}" @click="execute()" :disabled="!enableExecute"><i class="fas fa-play"></i></button>
            </div>
            <div class="level-item has-text-centered">
                <button class="button is-medium is-danger" :class="{'is-loading': loadingBlock}" @click="block()" :disabled="!enableBlock">
                      <i class="fas fa-ban"></i>
                </button>
            </div>
        </div>
        </div>
        <div class="level"></div>
        <div class="level"></div>
    </div>
</template>

<script>
import AddressBlock from "@/components/AddressBlock";
export default {
  data () {
    return {
      proposalData: [],
      isLoading: false,
      currentProposal: '',
      enableVote: false,
      contractOwner: false,
      enableExecute: false,
      enableBlock: false,
      loadingExecute: false,
      loadingBlock: false,
      tokensCount: '',
      now:''
    }
  },
  methods: {
    async updateBlockTime() {
       this.now = this.$d(await this.$eth.getLatestBlockTime() * 1000, 'long+');
    },

    startUpdatingTime() {
      this.updatingBlockData = setInterval(() => {
        this.updateBlockTime()
      }, 10 * 60 * 1000 /* 10 minutes */);

      this.updatingTicker = setInterval(async () => {
          await this.updateEnabledButtons()
      }, 1000);
      
    },

    async updateEnabledButtons () {
      this.isActive = +this.proposal.status === this.$libre.proposalStatuses[0].number;
      this.enableVote = this.$eth.toTimestamp(this.votes.deadline) > await this.$eth.getLatestBlockTime() * 1000 &&
                      !this.votes.voted &&
                      this.tokensCount >= this.$libre.proposalParams.minBalance / Math.pow(10, 18) &&
                      this.isActive;

      this.enableExecute = this.$eth.toTimestamp(this.votes.deadline) < await this.$eth.getLatestBlockTime() * 1000 && 
          this.isActive &&
          (this.votes.yea > this.votes.nay) &&
          (this.votes.yea + this.votes.nay >= this.$libre.toToken(this.$libre.proposalParams.quorum));
      this.enableBlock = this.contractOwner && this.isActive;
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
      this.tokensCount = this.$libre.toToken(await this.$libre.liberty.balanceOf(this.$eth.yourAccount));
    },

    async loadProposal () {
      const 
        struct = this.$libre.proposalStruct
    
      this.proposalData = []
      this.isLoading = true

      try {
        this.proposal = await this.$libre.updateProposal(this.$route.params.id),
        this.votes = this.proposal.vote;

        this.currentProposal = this.$libre.typeProposals[this.proposal.type]
        
        this.proposalData.push({
          name: this.$t('lang.dao.type-row'),
          value: this.currentProposal.text
        })

        this.proposalData.push({
          name: this.$t('lang.dao.status-row'),
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
                                this.$t('lang.common.yes') : this.$t('lang.common.no'));
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

        this.proposalData.push(
          {name: this.$t('lang.dao.voting-row'), value: `${this.votes.yea}/${this.votes.nay}`},
          {name: this.$t('lang.dao.deadline-row'), value: this.$d(this.votes.deadline * 1000, 'long+')},
          {name: this.$t('lang.dao.description-row'), value: this.proposal.description}
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
          txHash = await this.$libre.dao.vote(this.$route.params.id, support);
          
        this.$libre.notify(await this.$eth.isSuccess(txHash) ? this.$t('lang.tx.vote.success') :
                                                              this.$t('lang.tx.vote.fail'));
        await this.$libre.updateProposal(this.$route.params.id);
        this.loadProposal();
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err);
        console.log(msg);
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
          this.$libre.notify(this.$t('lang.tx.execute.success'));
        } else {
          this.$libre.notify(this.$t('lang.tx.execute.fail'));
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
          this.$libre.notify(this.$t('lang.tx.block.success'));
        } else {
          this.$libre.notify(this.$t('lang.tx.block.fail'));
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
      await this.checkOwner();
      await this.getTokensCount();
      await this.loadProposal();
      this.selectedType = this.$libre.typeProposals[0];
      this.startUpdatingTime();
    } catch (err) {
      console.log(err)
    }
  },
  destroyed () {
    this.clearTimers();
  },

  components: {
    AddressBlock
  }
}
</script>