<template>
  <div>
      <div class="table-padding">
        <div class="card">
            <div class="card-content">
                <address-block/>
                <div class="flex-mobile">{{ $t('lang.contracts.dao') }}: 
                  <a :href="$libre.addressToLink(contracts.dao)" target="_blank" class="is-text-overflow ">{{contracts.dao}}</a>
                </div>
                <div class="flex-mobile">{{ $t('lang.contracts.liberty') }}: 
                  <a :href="$libre.addressToLink(contracts.lbrs)" target="_blank" class="is-text-overflow ">{{contracts.lbrs}}</a>
                </div>
                <div>{{ $t('lang.dao.min-to-vote') }}: {{ $eth.toToken($libre.proposalParams.minBalance) }} LBRS</div>
                <div>{{ $t('lang.dao.min-count') }}: {{ $eth.toToken($libre.proposalParams.quorum) }} LBRS</div>
                <div>{{ $t('lang.dao.min-deadline', {period: $libre.proposalParams.minTime}) }}</div>
            </div>
        </div>
        <div class="level"></div>
        <nav class="level">
          <div class="level-item has-text-centered" v-if="$store.state.balances.lbrs >= $eth.toToken($libre.proposalParams.minBalance)">
            <div>
              <p class="heading">{{ $t('lang.common.create') }}</p>
              <p>
                <router-link :to="{ path: '/dao/new_proposal' }" class="button is-primary">{{ $t('lang.dao.new-proposal') }}</router-link>
              </p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">{{ $t('lang.dao.proposal-type') }}</p>
              <p>
                <b-field>
                  <b-radio-button v-model="filter" native-value="filterALL" type="is-success" @input="loadProposals()">
                    {{ $t('lang.common.all') }}
                  </b-radio-button>
                  <b-radio-button v-model="filter" native-value="filterActive" type="is-success" @input="loadProposals()">
                    {{ $t('lang.common.active') }}
                  </b-radio-button>
                </b-field>
              </p>
            </div>
          </div>
        </nav>
        <div class="level"></div>
        <b-table
          class="centered"
          :data="tableData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="isLoading"
          :paginated="perPage < tableData.length"
          :per-page="perPage"
          :current-page.sync="currentPage"
          :pagination-simple="false"
          :mobile-cards="true"
          :responsive="true">
          <template slot-scope="props" v-if="!props.row.tempHide">
            <b-table-column field="report.type" :label="$t('lang.common.type')" centered>
              <p>{{ props.row.loading ? $t('lang.common.loading-dots') : props.row.type }}</p>
              <p v-if="props.row.status == $t('lang.common.statuses.finished')" class="tag is-success is-rounded">
                {{ $t('lang.dao.finished') }}
              </p>
              <p v-if="props.row.status == $t('lang.common.statuses.blocked')" class="tag is-danger is-rounded">
                {{ $t('lang.dao.blocked') }}
              </p>
            </b-table-column>
            <b-table-column :label="$t('lang.common.recipient')" centered v-if="props.row.recipient == '-'">
                {{ $t('lang.common.not-set') }}
            </b-table-column>
            <b-table-column :label="$t('lang.common.recipient')" centered v-else>
              <a :href="$libre.addressToLink(props.row.recipient)" target="_blank">{{ $t('lang.common.address') }}</a>
            </b-table-column>
            <b-table-column field="report.amount" :label="$t('lang.common.amount')" centered>
              {{ props.row.amount }}
            </b-table-column>
            <b-table-column field="report.buffer" :label="$t('lang.common.buffer')" centered>
              {{ props.row.buffer }}
            </b-table-column>
            <b-table-column :label="$t('lang.common.description')" centered>
              {{ props.row.description }}
            </b-table-column>
            <b-table-column :label="$t('lang.common.votes')" centered>
              {{ props.row.yea }} / {{ props.row.nay }}
            </b-table-column>
             <b-table-column :label="$t('lang.common.deadline')" centered>
              <p>{{ $d(props.row.deadlineUnix, 'long+') }}</p>
              <p v-if="props.row.deadlineUnix <= $store.state.time" class="tag is-warning is-rounded">
                {{ $t('lang.common.outdated') }}
              </p>
            </b-table-column>
            <b-table-column :label="$t('lang.common.actions')" centered>
              <!-- details button -->
              <b-tooltip :label="$t('lang.common.details')" type="is-dark" position="is-bottom">
                <router-link :to="{name: 'DAO Proposal Info', params: { id: props.row.id }}" tag="button" class="button"><i class="fas fa-id-card"></i></router-link>
              </b-tooltip>
              <!-- vote buttons -->
              <span v-if="!props.row.votingData.voted &&
                          (props.row.deadlineUnix > $store.state.time) &&
                          !props.row.loading &&
                          ($store.state.balances.lbrs >= $eth.toToken($libre.proposalParams.minBalance)) &&
                          (props.row.status === $libre.proposalStatuses[0].text)">
                <b-tooltip :label="$t('lang.dao.yea')" type="is-dark" position="is-bottom">
                  <button class="button" v-on:click="vote(props.row, true)"><i class="fas fa-thumbs-up"></i></button>
                </b-tooltip>
                <b-tooltip :label="$t('lang.dao.nay')" type="is-dark" position="is-bottom">
                  <button class="button" v-on:click="vote(props.row, false)"><i class="fas fa-thumbs-down"></i></button>
                </b-tooltip>
              </span>
              <!-- execute button -->
              <span v-else-if="props.row.deadlineUnix <= $store.state.time &&
                              (props.row.status === $libre.proposalStatuses[0].text) &&
                              !props.row.loading &&
                              (props.row.yea > props.row.nay) &&
                              (props.row.yea + props.row.nay >= $eth.toToken($libre.proposalParams.quorum))">
                <b-tooltip :label="$t('lang.common.execute')" type="is-dark" position="is-bottom">
                  <button class="button" v-on:click="execute(props.row)"><i class="fas fa-play"></i></button>
                </b-tooltip>
              </span>
              <span v-else-if="props.row.loading">
                {{ $t('lang.common.loading') }}
              </span>
              <!-- block button -->
              <span v-if="isOwner &&
                          (props.row.status === $libre.proposalStatuses[0].text) &&
                          !props.row.loading">
                <b-tooltip :label="$t('lang.dao.block')" type="is-dark" position="is-bottom">
                  <button class="button" v-on:click="block(props.row)"><i class="fas fa-ban"></i></button>
                </b-tooltip>
              </span>
            </b-table-column>
          </template>
        </b-table>
      </div>
  </div>
</template>

<script>
import AddressBlock from '@/components/AddressBlock'
export default {
  data () {
    return {  
      contracts:{
        dao: null,
        lbrs: null,
      },
      tableData: [],
      isLoading: false,
      filter: "filterALL",
      currentPage: 1,
      perPage: 5,
      isOwner: false
    }
  },
  methods: {
    async addProposal (index) {
      var proposal = this.$libre.proposals[index];
      var vote = proposal.vote;

      if (this[this.filter](proposal))
      {
        if (this.tableData.length == this.perPage) this.isLoading = false
        this.tableData.push({
            id: index,
            type: this.$libre.typeProposals[proposal.type].text,
            recipient: this.$eth.isZeroAddress(proposal.recipient) ? '-' : proposal.recipient,
            amount: proposal.amount,
            buffer: proposal.buffer,
            bytecode: proposal.bytecode,
            votingData: vote,
            yea: vote.yea,
            nay: vote.nay,
            deadlineUnix: this.$eth.toTimestamp(vote.deadline),
            description: proposal.description,
            loading: false,
            status: this.$libre.proposalStatuses[+proposal.status].text
        })
      }
    },

    filterALL(proposal) {
      return true;
    },

    filterActive(proposal) {
      return proposal.status == 0;
    },

    async loadProposals () {
      this.tableData = []
      this.isLoading = true

      await this.$libre.updateProposals(this.addProposal);
      if (this.tableData.length == 0) {
        for(let i = this.$libre.proposals.length - 1; i >= 0; i--)
          this.addProposal(i)
      }

      this.tableData.forEach(element => {
        element.updateTimer = setInterval(async () => {
          // we can check type of proposal, but we won't
          // the changing of the type can be seen in another timer by detecting change of numProposals
          
          var vote = (await this.$libre.updateProposal(element.id)).vote;
          element.yea = vote.yea
          element.nay = vote.nay
          element.votingData = vote
        }, 60 * 1000 + Math.random() * 5000)
      });

      this.isLoading = false

      var loginChecker = setInterval(() => {
        if (this.$store.state.address != null) {
          clearInterval(loginChecker)
        }
      }, 1000)
    },

    async vote (row, support) {
      let 
        id = row.id,
        votingData = row.votingData

      row.loading = true
      try {
        let txHash = await this.$libre.dao.vote(id, support);

        if (await this.$eth.isSuccess(txHash))
          this.$libre.notify(this.$t('lang.tx.vote.success'));
        else
          this.$libre.notify(this.$t('lang.tx.vote.fail'),'is-info')
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg, 'is-danger');
      }

      try {
        let voteData = (await this.$libre.updateProposal(row.id)).vote;
        row.yea = voteData.yea;
        row.nay = voteData.nay;
        row.votingData = voteData;
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg, 'is-danger');
      }
      row.loading = false
    
    },
    async block (row) {
      row.loading = true

      try {
        let txHash = await this.$libre.dao.blockingProposal(row.id);
        
        if (await this.$eth.isSuccess(txHash))
          this.$libre.notify(this.$t('lang.tx.block.success'));
        else
          this.$libre.notify(this.$t('lang.tx.block.fail'),'is-info');
        let proposalStatus = (await this.$libre.updateProposal(row.id)).status;
        row.status = this.$libre.proposalStatuses[proposalStatus].text // it is "Finished" but we shall recheck
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg, 'is-danger');
      }
      row.loading = false
    },

    async execute(row) {
      row.loading = true
      
      let 
        id = row.id
      
      try {
        let txHash = await this.$libre.dao.executeProposal(id);

        if (await this.$eth.isSuccess(txHash))
          this.$libre.notify(this.$t('lang.tx.execute.success'));
        else
          this.$libre.notify(this.$t('lang.tx.execute.fail'),'is-info');
        let proposalStatus = (await this.$libre.updateProposal(row.id)).status;
        row.status = this.$libre.proposalStatuses[proposalStatus].text // it is "Finished" but we shall recheck
      } catch(err) {
        let msg = this.$eth.getErrorMsg(err)
        console.log(msg)
        this.$libre.notify(msg,'is-danger');
      }

      row.loading = false
    },

    clearTimers() {
      this.tableData.forEach(element => {
        clearInterval(element.updateTimer)
      })
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;

      this.contracts = {
        dao: this.config.dao.address,
        lbrs: await this.$libre.dao.sharesTokenAddress(),
      }
      this.isOwner = (await this.$libre.dao.owner() === this.$store.state.address);

      this.loadProposals();
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