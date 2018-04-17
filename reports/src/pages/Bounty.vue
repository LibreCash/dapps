<template>
  <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">Bounty program</h2>
      </div>
      <br>
      <div class="table-padding">
        <address-block>one</address-block>
        <div>ComplexBank bounty contract address: {{ bountyBankAddress }}</div>
        <div>ComplexExchanger bounty contract address: {{ bountyExchangerAddress }}</div>
        <div>Current time: {{ new Date(curBlockchainTime * 1000).toLocaleString() }}</div>
        <div class="columns" style="padding-top: 2rem">
          <div class="column is-narrow">
            <router-link :to="{ path: '/dao/new_offer' }" class="button is-primary">New Targets</router-link>
          </div>


        </div>
        <br>
        <div v-if="targetCount == 0">
          No loans for selected filter
        </div>

        <b-table
          v-if="searchData.length > 0"
          :data="isEmpty ? [] : searchData"
          :bordered="isBordered"
          :striped="isStriped"
          :narrowed="isNarrowed"
          :loading="tableLoading"
          :per-page="perPage"
          :current-page.sync="currentPage"
          :mobile-cards="hasMobileCards"
          :responsive="isResponsive">
          <template slot-scope="props" v-if="!props.row.tempHide">
            <b-table-column label='Address' centered v-if="props.row.address == '-'">
                not set
            </b-table-column>
            <b-table-column label='Address' centered v-else>
              <a :href="'https://rinkeby.etherscan.io/address/'+props.row.address">address</a>
            </b-table-column>

            <b-table-column label='Name' centered>
              {{ props.row.name }}
            </b-table-column>
            <b-table-column label='ABI' centered>
              button get abi
            </b-table-column>
            <b-table-column label='Mist import' centered>
              button get script
            </b-table-column>
            <b-table-column label='Hacked' centered>
              No
                <b-tooltip label="Update info" type="is-dark" position="is-bottom">
                    <button v-on:click="update(props.row)"><i class="mdi mdi-refresh"></i></button>
                </b-tooltip>
            </b-table-column>            
            <b-table-column label='Actions' centered>
                <b-tooltip label="Claim reward" type="is-dark" position="is-bottom">
                    <button v-on:click="claim(props.row)"><i class="mdi mdi-target"></i></button>
                </b-tooltip>
            </b-table-column>
          </template>
        </b-table>
        <div class="columns">
          <div class="column is-narrow">
            <b-tooltip label="Items on page">
              <b-field>
                <b-select v-model="perPage" @input="loadTargets()">
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="300">300</option>
                </b-select>
              </b-field>
            </b-tooltip>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AddressBlock from '@/components/AddressBlock'
import Config from '@/config'
export default {
  data () {
    return {
      isEmpty: false,
      isBordered: false,
      isStriped: true,
      isNarrowed: false,
      tableLoading: false,
      hasMobileCards: true,
      isResponsive: true,
      currentPage: 1,
      perPage: 5,
      curBlockchainTime: 0,
      bountyBankAddress: '',
      bountyExchangerAddress: '',
      searchData: [],
      isSimple: false,
      isRounded: true,
      paginationOrder: 'is-centered',
      defaultAddress: '',
      pages: [1],
      vpage: 1,
      ethType: 'ETH',
      isActive: true,
      isUsed: false,
      isCompleted: false,
      isMine: false,
      targetCount: 0,
      perPage: 10,
      curBlockchainTime: 0
    }
  },
  methods: {
    async loadTargets (e) {
      this.searchData = [];

      const maxUINT256 = 2**256 - 1;

      this.tableLoading = true
      try {
        let bankTargets = await this.$libre.bounty.bank.getMyTargets();
        let exchangerTargets = await this.$libre.bounty.exchanger.getMyTargets();

        for (var i = 0; i < bankTargets.length; i++) {
          // do not use forEach - we do not want async iterations
          var 
            bankTarget = bankTargets[i];

          this.searchData.push({
              id: i,
              address: bankTarget,
              name: '...',
              contract: this.$libre.getContract(Config.bounty.bank.targets.bank.abi, bankTarget)
              //recipient: this.$eth.isZeroAddress(loan.recipient) ? '-' : loan.recipient,
              //timestampUnix: loan.timestamp,
              //timestamp: new Date(loan.timestamp * 1000).toLocaleString(),
              //period: new Date((loan.timestamp + loan.period) * 1000).toLocaleString(),
              //amount: this.$eth.fromWei(loan.amount),
              //margin: this.$eth.fromWei(loan.margin),
              //refund: this.$eth.fromWei(loan.refund),
              //status: loan.status
          });
          let searchDataLength = this.searchData.length;
          console.log(this.searchData[searchDataLength - 1].contract);
          
          this.searchData[searchDataLength - 1].contract.targetName().then((_name) => {
              this.searchData[searchDataLength - 1].name = _name;
              if (_name == "LibreCash") {
                this.searchData[searchDataLength - 1].contract = this.$libre.getContract(Config.bounty.bank.targets.token.abi, bankTarget);
              }
              
          })
        }
      } catch (err) {
        console.log(err)
      }

      this.tableLoading = false
    },
    async updateBlockTime() {
      this.curBlockchainTime = +(await this.$eth.getLatestBlockTime())
    },

    startUpdatingTime() {
      this.curBlockchainTime = 0
      this.updatingTicker = setInterval(() => {
        this.curBlockchainTime++
      }, 1000)
      this.updatingBlockData = setInterval(() => {
        this.updateBlockTime()
      }, 10 * 60 * 1000 /* 10 minutes */)
      this.updateBlockTime()
    },
    clearTimers() {
      let intervals = [
        this.updatingTicker,
        this.updatingBlockData,
      ]

      intervals.forEach((interval) => clearInterval(interval))
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.defaultAddress = window.web3.eth.defaultAccount;
      this.bountyBankAddress = Config.bounty.bank.address;
      this.bountyExchangerAddress = Config.bounty.exchanger.address;
      this.startUpdatingTime();
      this.loadTargets();
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