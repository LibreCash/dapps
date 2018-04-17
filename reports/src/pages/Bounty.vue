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

        <b-table
          v-if="searchData.length > 0"
          :data="isEmpty ? [] : searchData"
          :bordered="isBordered"
          :striped="isStriped"
          :narrowed="isNarrowed"
          :loading="tableLoading"
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
                <b-tooltip label="Get ABI" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="showABI(props.row)"><i class="mdi mdi-json"></i></button>
                </b-tooltip>
            </b-table-column>
            <b-table-column label='Mist import' centered>
                <b-tooltip label="Get ABI" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="showMist(props.row)"><i class="mdi mdi-currency-eth"></i></button>
                </b-tooltip>
            </b-table-column>
            <b-table-column label='Hacked' centered>
                {{ props.row.hacked }}
                <b-tooltip label="Update info" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="update(props.row)"><i class="mdi mdi-refresh"></i></button>
                </b-tooltip>
            </b-table-column>            
            <b-table-column label='Actions' centered>
                <b-tooltip label="Claim reward" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="claim(props.row)" :disabled="!props.row.hacked"><i class="mdi mdi-target"></i></button>
                </b-tooltip>
            </b-table-column>
          </template>
        </b-table>
      </div>
    </section>
  </div>
</template>

<script>
import AddressBlock from '@/components/AddressBlock'
import Config from '@/config'

const modalABI = {
    props: ['title', 'data'],
    template: `
        <form action=''>
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">{{ title }}</p>
                </header>
                <section class="modal-card-body">
                    <b-field label="Data">
                        <b-input type="textarea" :value="data"></b-input>
                    </b-field>
                </section>
                <footer class="modal-card-foot">
                    <button class="button" type="button" @click="$parent.close()">Close</button>
                </footer>
            </div>
        </form>
    `
}

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
      curBlockchainTime: 0,
      bountyBankAddress: '',
      bountyExchangerAddress: '',
      searchData: [],
      defaultAddress: '',
      isActive: true,
      isUsed: false,
      isCompleted: false,
      isMine: false,
      targetCount: 0,
      curBlockchainTime: 0

    }
  },
  methods: {
    getABI (row) {
        let ABI;
        if (row.name == "LibreCash") ABI = Config.bounty.bank.targets.token.abi;
        else if (row.name == "ComplexBank") ABI = Config.bounty.bank.targets.bank.abi;
        else if (row.name == "ComplexExchanger") ABI = Config.bounty.exchanger.targets.exchanger.abi;
        else ABI = "ABI not fount for this type of target";
        return ABI;
    },
    showABI (row) {
        this.$modal.open({
            parent: this,
            component: modalABI,
            hasModalCard: true,
            props: {
                title: 'Contract ABI',
                data: JSON.stringify(this.getABI(row))
            }
        })
    },
    showMist (row) {
        let ABI = JSON.stringify(this.getABI(row));
        let address = row.address;
        let name = row.name;
        let mistData = 
`CustomContracts.insert({
    address: "${address}",
    name: "_${name}",
    jsonInterface: ${ABI}
});`;
        this.$modal.open({
            parent: this,
            component: modalABI,
            hasModalCard: true,
            props: {
                title: 'Mist import script',
                data: mistData
            }
        })
    },
    async claim (row) {
      try {
        this.tableLoading = true;
        let 
          txHash = await row.bountyContract.claim(row.address);
        let
          result = await this.$eth.isSuccess(txHash) ? 'Success claim transaction' : 'Failed claim transaction';

        alert(result); // Replace it to notify
        this.tableLoading = false;
      } catch(err) {
        alert(this.$eth.getErrorMsg(err));
        this.tableLoading = false;
      }
    },
    update (row) {
        row.contract.checkInvariant(this.defaultAddress).then((notHacked) => {
            row.hacked = !notHacked;
        });
    },
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
              contract: this.$libre.getContract(Config.bounty.bank.targets.bank.abi, bankTarget),
              hacked: false,
              bountyContract: this.$libre.bounty.bank
          });
          let searchDataLength = this.searchData.length;
          
          this.searchData[searchDataLength - 1].contract.targetName().then((_name) => {
              this.searchData[searchDataLength - 1].name = _name;
              if (_name == "LibreCash") {
                this.searchData[searchDataLength - 1].contract = this.$libre.getContract(Config.bounty.bank.targets.token.abi, bankTarget);
              }
            
          });
          this.searchData[searchDataLength - 1].contract.checkInvariant(this.defaultAddress).then((notHacked) => {
              this.hacked = !notHacked;
          });
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